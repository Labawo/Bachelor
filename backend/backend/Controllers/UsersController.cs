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
            .Select(u => new UserDto(u.Id, u.UserName, u.Email))
            .ToList();

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
            return NotFound("User not found.");
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
    [Route("resetPassword")]
    [Authorize(Roles = SiteRoles.Admin + "," + "," + SiteRoles.Student)]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        var user = await _userManager.FindByIdAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));

        if (user == null)
        {
            return NotFound("User not found.");
        }

        var result = await _userManager.ChangePasswordAsync(user, resetPasswordDto.CurrentPassword, resetPasswordDto.NewPassword);

        if (result.Succeeded)
        {
            return Ok("Password changed successfully.");
        }
        return BadRequest(result.Errors);
    }
}