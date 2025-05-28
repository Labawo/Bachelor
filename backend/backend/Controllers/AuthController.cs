using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Auth;
using backend.Auth.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace backend.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api")]
public class AuthController : ControllerBase
{
    private readonly UserManager<SiteUser> _userManager;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(UserManager<SiteUser> userManager, IJwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
    }

    [HttpGet]
    [Route("test")]
    public async Task<IActionResult> TestingRoute()
    {
        return Ok(Request.Host);
    }


    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(RegisterUserDto registerUserDto)
    {
        var user = await _userManager.FindByNameAsync(registerUserDto.UserName);

        if (user != null)
            return BadRequest("Šis naudotojas jau egzistuoja.");

        var newUser = new SiteUser
        {
            Email = registerUserDto.Email,
            UserName = registerUserDto.UserName,
            XP = 0,
            PLevel = 0,
            WPM = 0,
            Skill = "Beginner",
            WPM10 = 0,
            QuizXp = 0,
            QuizDone = 0,
            RegistrationDate = DateTime.Now
        };

        var createUserResult = await _userManager.CreateAsync(newUser, registerUserDto.Password);

        if (!createUserResult.Succeeded)
            return BadRequest("Negalima sukurti naudotojo.");

        await _userManager.AddToRoleAsync(newUser, SiteRoles.Student);
        
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);

        //var confirmationLink = Url.Action("ConfirmEmail", "api", new { userId = newUser.Id, token = token }, Request.Scheme);

        /*var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse("hesm6150@gmail.com"));
        email.To.Add(MailboxAddress.Parse(newUser.Email));
        email.Subject = "Elektroninio pašto patvirtinimas";
        email.Body = new TextPart(TextFormat.Html) { Text = confirmationLink };

        using var smtp = new SmtpClient();
        smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        smtp.Authenticate("hesm6150@gmail.com", "zqkulfficavlkbap");
        smtp.Send(email);
        smtp.Disconnect(true);*/

        //string? route = Request.Host.Value + Request.Path.Value.Replace("register", "ConfirmEmail") + "?userId=" + newUser.Id + "&token=" + token != null ? token : "empty";
        string? route = "empty";

        return CreatedAtAction(nameof(Register), new UserWithConfimationLinkDto(newUser.Id, newUser.UserName, token, route));
    }

    [HttpGet]
    [Route("ConfirmEmail")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        if (userId == null || token == null)
        {
            return BadRequest();
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return BadRequest("Naudotojas neegzistuoja.");

        var result = await _userManager.ConfirmEmailAsync(user, token);

        if(result.Succeeded)
        {
            return Ok();
        }

        return BadRequest();
    }
    
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByNameAsync(loginDto.UserName);

        if (user == null)
            return BadRequest("Naudotojas su vardu ar slaptažodžiu neegzistuoja.");

        if (!user.EmailConfirmed)
        {
            return BadRequest("Naudotojui reikia patvirtinti slaptažodį.");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        
        if (!isPasswordValid)
            return BadRequest("Naudotojas su vardu ar slaptažodžiu neegzistuoja.");

        user.ForceRelogin = false;
        await _userManager.UpdateAsync(user);
        // valid user
        var roles = await _userManager.GetRolesAsync(user);
        
        var accessToken = _jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
        var refreshToken = _jwtTokenService.CreateRefreshToken(user.Id);

        return Ok(new SuccessfulLoginDto(accessToken, refreshToken));
    }
    
    [HttpPost]
    [Route("accessToken")]
    public async Task<IActionResult> UpdateToken(RefreshAccessTokenDto refreshAccessToken)
    {
        if (!_jwtTokenService.TryParseRefreshToken(refreshAccessToken.RefreshToken, out var claims))
        {
            return BadRequest();
        }

        var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return BadRequest("Netinkamas žetonas");
        }

        if (user.ForceRelogin)
        {
            return BadRequest();
        }
        
        var roles = await _userManager.GetRolesAsync(user);
        
        var accessToken = _jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
        var refreshToken = _jwtTokenService.CreateRefreshToken(user.Id);
        
        return Ok(new SuccessfulLoginDto(accessToken, refreshToken));
    }

}