using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using backend.Auth.Models;
using backend.Data.Entities;
using backend.Data.Repositories;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using System.Linq;

namespace backend.Controllers;

[ApiController]
[Route("api")]
public class UsersController : ControllerBase
{
    private readonly UserManager<SiteUser> _userManager;
    
    public UsersController(UserManager<SiteUser> userManager)
    {
        _userManager = userManager;
    }
    
    [HttpGet]
    [Route("users")]
    [Authorize(Roles = SiteRoles.Admin)]
    public IActionResult GetUsers()
    {
        var allUsers =  _userManager.Users.ToList(); 

        var nonAdminUsers = allUsers
            .Where(u => !_userManager.IsInRoleAsync(u, SiteRoles.Admin).Result) // Filter out Admin users
            .Select(u => new UserStatDto(u.Id, u.UserName, u.Email, u.RegistrationDate, u.EmailConfirmed, u.QuizDone == null ? 0 : (int)u.QuizDone, u.WPM == null ? 0 : (int)u.WPM, u.WPM10 == null ? 0 : (int)u.WPM10))
            .ToList();

        return Ok(nonAdminUsers);
    }
    
    [HttpGet]
    [Route("topUsers")]
    [Authorize]
    public IActionResult GetUsersBadges()
    {
        var allUsers =  _userManager.Users.ToList(); 

        var nonAdminUsers = allUsers
            .Where(u => !_userManager.IsInRoleAsync(u, SiteRoles.Admin).Result) // Filter out Admin users
            .Select(u => new UserTopDto(u.UserName, u.NewBadgeCnt, u.RegistrationDate?.Year))
            .OrderByDescending(u => u.BadgeCount).Take(10).ToList();

        return Ok(nonAdminUsers);
    }
    
    [HttpDelete]
    [Route("users/{userId}")]
    [Authorize(Roles = SiteRoles.Admin)] // Assuming only administrators can delete users
    public async Task<IActionResult> DeleteUser(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound("Naudotojas nerastas.");
        }

        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded)
        {
            return NoContent(); // 204 No Content - Successful deletion
        }
        // If the deletion was not successful, return the errors
        return BadRequest(result.Errors);
    }
    
    //block mb and user permission
    
    [HttpPut]
    [Route("changePassword/{userId}")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<IActionResult> ChangePassword(string userId, ChangePasswordDto changePasswordDto)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound("Naudotojas nerastas.");
        }

        if (user.PasswordReset > DateTime.UtcNow)
        {
            return Forbid();
        }

        user.PasswordReset = DateTime.UtcNow.AddDays(1);

        var updateResult = await _userManager.UpdateAsync(user);

        if (!updateResult.Succeeded)
        {
            return Forbid();
        }

        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, resetToken, changePasswordDto.NewPassword);

        if (result.Succeeded)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("hesm6150@gmail.com"));
            email.To.Add(MailboxAddress.Parse(user.Email));
            email.Subject = "Password changed";
            email.Body = new TextPart(TextFormat.Html) { Text = "Please contact admin for your new password. (+3701234555)" };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("hesm6150@gmail.com", "zqkulfficavlkbap");
            smtp.Send(email);
            smtp.Disconnect(true);
            
            return Ok("Slaptažodis atnaujintas sėkmingai.");
        }
        return BadRequest(result.Errors);
    }
    
    [HttpPut]
    [Route("resetPassword")]
    [Authorize(Roles = SiteRoles.Admin + "," + SiteRoles.Student)]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        var user = await _userManager.FindByIdAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));

        if (user == null)
        {
            return NotFound("Naudotojas nerastas.");
        }

        var result = await _userManager.ChangePasswordAsync(user, resetPasswordDto.CurrentPassword, resetPasswordDto.NewPassword);

        if (result.Succeeded)
        {
            return Ok("Slaptažodis atnaujintas sėkmingai.");
        }
        return BadRequest(result.Errors);
    }
    
    [HttpPut]
    [Route("updateProfile")]
    [Authorize(Roles = SiteRoles.Admin + "," + SiteRoles.Student)]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDto updateProfileDto)
    {
        var user = await _userManager.FindByIdAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));

        if (user == null)
        {
            return NotFound("Naudotojas nerastas.");
        }

        user.Name = updateProfileDto.Name;
        user.LastName = updateProfileDto.LastName;
        
        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            return Ok("Profilis atnaujintas sėkmingai.");
        }
        return BadRequest(result.Errors);
    }
    
    [HttpGet]
    [Route("statistics")]
    [Authorize(Roles = SiteRoles.Admin + "," + SiteRoles.Student)]
    public async Task<ActionResult<UserStatisticsDto>> UserStatistics()
    {
        var user = await _userManager.FindByIdAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));

        if (user == null)
        {
            return NotFound("Naudotojas nerastas.");
        }
        
        var userStatsDto = new UserStatisticsDto(user.NewBadgeCnt, user.WPM/user.WPM10, user.QuizDone, user.QuizXp, user.XP);

        return Ok(userStatsDto);
    }
    
    [HttpPut]
    [Route("updateUser/{userId}")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<IActionResult> UpdateUser(string userId, UpdateProfileDto updateProfileDto)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound("Naudotojas nerastas.");
        }

        user.Name = updateProfileDto.Name;
        user.LastName = updateProfileDto.LastName;
        
        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            return Ok("Profilis atnaujintas sėkmingai.");
        }
        return BadRequest(result.Errors);
    }
}