using Microsoft.AspNetCore.Identity;

namespace backend.Auth.Models;

public class SiteUser : IdentityUser
{
    [PersonalData]
    public string? Name { get; set; }
    public string? LastName { get; set; }
    public DateTime? TestTimer { get; set; }
    public DateTime? PasswordReset { get; set; }
    public DateTime? CancelTimer { get; set; }
    public bool ForceRelogin { get; set; }
}