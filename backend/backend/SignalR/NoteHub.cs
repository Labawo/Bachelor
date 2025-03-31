using backend.Data.Dtos.Notes;
using backend.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.AspNetCore.SignalR;
using backend.Data.Entities;
using backend.Auth.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.SignalR
{
    //[Authorize]
    public class NoteHub : Hub
    {
        INotesRepository _notesRepository;
        private readonly UserManager<SiteUser> _userManager;

        public NoteHub(INotesRepository notesRepository, UserManager<SiteUser> userManager)
        {
            _notesRepository = notesRepository;
            _userManager = userManager;
        }

        public async Task SendNote(string content, string name, string id)
        {
            var httpContext = Context.GetHttpContext();

            var note = new Note
            {
                Name = name,
                Content = content,
                Time = DateTime.UtcNow,
                OwnerId = id
            };

            await _notesRepository.CreateAsync(note);

            await Clients.Group("1").SendAsync("ReceiveNote", note);
        }

        [Authorize(Roles = SiteRoles.Admin)]
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            //var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            await Groups.AddToGroupAsync(Context.ConnectionId, "1");

            var result = await _notesRepository.GetManyAsync();

            await Clients.Caller.SendAsync("LoadNotes", result.Select(o => new NoteDto(o.Id, o.Name, o.Content, o.OwnerId)));
        }
    }
}
