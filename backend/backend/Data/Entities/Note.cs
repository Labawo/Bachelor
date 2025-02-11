using System.ComponentModel.DataAnnotations;
using backend.Auth.Models;

namespace backend.Data.Entities;

public class Note : IUserOwnedResource
{
    public int Id { get; set; }
    public DateTime Time { get; set; }
    public string Name { get; set; }
    public string Content { get; set; }
    
    [Required]
    public string OwnerId { get; set; }
    public SiteUser Owner { get; set; }
}