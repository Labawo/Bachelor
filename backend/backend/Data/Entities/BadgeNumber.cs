using System.ComponentModel.DataAnnotations;
using backend.Auth.Models;

namespace backend.Data.Entities;

public class BadgeNumber : IUserOwnedResource
{
    public int Id { get; set; }
    public int EarnedBadges { get; set; }
    
    [Required]
    public int BadgeId { get; set; }
    public Badge badge { get; set; }
    public required string OwnerId { get; set; }
    public SiteUser Owner { get; set; }
}