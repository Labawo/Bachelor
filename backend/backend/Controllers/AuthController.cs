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
    
    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(RegisterUserDto registerUserDto)
    {
        var user = await _userManager.FindByNameAsync(registerUserDto.UserName);

        if (user != null)
            return BadRequest("This user already exists.");

        var newUser = new SiteUser
        {
            Email = registerUserDto.Email,
            UserName = registerUserDto.UserName,
            XP = 0,
            PLevel = 0,
            Skill = "Beginner",
            WPM = 0,
            WPM10 = 0
        };

        var createUserResult = await _userManager.CreateAsync(newUser, registerUserDto.Password);

        if (!createUserResult.Succeeded)
            return BadRequest("Could not create a user.");

        await _userManager.AddToRoleAsync(newUser, SiteRoles.Student);
        
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
        
        var confirmationLink = Url.Action("ConfirmEmail", "Account", new { userId = newUser.Id, token = token }, Request.Scheme);
        
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse("hesm6150@gmail.com"));
        email.To.Add(MailboxAddress.Parse(newUser.Email));
        email.Subject = "Elektroninio pašto patvirtinimas";
        email.Body = new TextPart(TextFormat.Html) { Text = confirmationLink };

        using var smtp = new SmtpClient();
        smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        smtp.Authenticate("hesm6150@gmail.com", "zqkulfficavlkbap");
        smtp.Send(email);
        smtp.Disconnect(true);
            
        return Ok("Password changed successfully.");

        return CreatedAtAction(nameof(Register), new UserDto(newUser.Id, newUser.UserName, newUser.Email));
    }
    
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByNameAsync(loginDto.UserName);

        if (user == null)
            return BadRequest("User with name or password does not exist.");

        if (!user.EmailConfirmed)
        {
            return BadRequest("User needs to confirm email.");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        
        if (!isPasswordValid)
            return BadRequest("User with name or password does not exist.");

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
            return BadRequest("Invalid token");
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