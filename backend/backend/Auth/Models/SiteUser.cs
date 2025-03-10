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
    public bool? Blocked { get; set; }
    public int? QuizXp { get; set; }
    public int? QuizDone { get; set; }
    public int? OldBadgeCnt { get; set; }
    public int? NewBadgeCnt { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public bool ForceRelogin { get; set; }
}