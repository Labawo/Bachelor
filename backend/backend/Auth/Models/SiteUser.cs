using Microsoft.AspNetCore.Identity;

namespace backend.Auth.Models;

public class SiteUser : IdentityUser
{
    [PersonalData]
    public string? Name { get; set; }
    public string? LastName { get; set; }
    public DateTime? PasswordReset { get; set; }
    public int? XP { get; set; }
    public int? WPM { get; set; }
    public int? WPM10 { get; set; }
    public string? Skill { get; set; }
    public int? PLevel { get; set; }
    public string? ProfileImage { get; set; }
    public bool ForceRelogin { get; set; }
}