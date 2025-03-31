using backend.Data.Dtos.Notes;
using backend.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.AspNetCore.SignalR;
using backend.Data.Entities;
using backend.Auth.Models;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IO;

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

        public async Task SendNote(string content, string name, string accessToken)
        {
            var httpContext = Context.GetHttpContext();

            var keys = new List<SecurityKey>();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("123456789zxcvbnmasdfghjklqwertyu"));
            keys.Add(key);

            var sub = "";
            if(ValidateToken(accessToken, "Laurynas", "TrustedClient", keys))
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
            var httpContext = Context.GetHttpContext();

            var keys = new List<SecurityKey>();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("123456789zxcvbnmasdfghjklqwertyu"));
            keys.Add(key);

            var sub = "";
            if (ValidateToken(accessToken, "Laurynas", "TrustedClient", keys))
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

        [Authorize(Roles = SiteRoles.Admin)]
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            //var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            await Groups.AddToGroupAsync(Context.ConnectionId, "1");

            var result = await _notesRepository.GetManyAsync();

            await Clients.Caller.SendAsync("LoadNotes", result.Select(o => new NoteDto(o.Id, o.Name, o.Content, o.OwnerId)));
        }

        public bool ValidateToken(string token, string issuer, string audience, ICollection<SecurityKey> signingKeys)
        {
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = signingKeys,
                ValidateLifetime = true
            };

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                return true;
            }
            catch (SecurityTokenValidationException ex)
            {
                return false;
            }
        }
    }
}
