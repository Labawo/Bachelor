using backend.Data.Dtos.Notes;
using backend.Data.Repositories;
using Microsoft.AspNetCore.SignalR;
using backend.Data.Entities;
using backend.Auth.Models;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;

namespace backend.SignalR
{
    public class NoteHub : Hub
    {
        private readonly INotesRepository _notesRepository;
        private readonly UserManager<SiteUser> _userManager;

        public NoteHub(INotesRepository notesRepository, UserManager<SiteUser> userManager)
        {
            _notesRepository = notesRepository;
            _userManager = userManager;
        }

        public async Task SendNote(string content, string name, string accessToken)
        {
            var sub = "";
            if(SignalRHelper.ValidateToken(accessToken, "Laurynas", "TrustedClient"))
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(accessToken);
                var tokenS = jsonToken as JwtSecurityToken;
                sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            }

            var note = new Note
            {
                Name = name,
                Content = content,
                Time = DateTime.UtcNow,
                OwnerId = sub
            };

            await _notesRepository.CreateAsync(note);

            await Clients.Group("1").SendAsync("ReceiveNote", note);
        }

        public async Task DeleteNote(int noteId, string accessToken)
        {
            var sub = "";
            if (SignalRHelper.ValidateToken(accessToken, "Laurynas", "TrustedClient"))
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(accessToken);
                var tokenS = jsonToken as JwtSecurityToken;
                sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            }

            var note = await _notesRepository.GetAsync(noteId);

            if (note == null)
            {
                return;
            }

            await _notesRepository.RemoveAsync(note);

            await Clients.Group("1").SendAsync("RemoveNote", note);
        }
        
        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "1");

            var result = await _notesRepository.GetManyAsync();

            await Clients.Caller.SendAsync("LoadNotes", result.Select(o => new NoteDto(o.Id, o.Name, o.Content, o.OwnerId)));
        }

        
    }
}
