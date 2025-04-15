using System.ComponentModel.DataAnnotations;
using backend.Auth.Models;

namespace backend.Data.Entities;

public class Level
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public int ItemCount { get; set; }
    public int MinExperience { get; set; }
    public bool IsForWords { get; set; }
}