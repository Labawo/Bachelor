using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Auth.Models;
using backend.Data.Entities;

namespace backend.Data;

public class LS_DbContext : IdentityDbContext<SiteUser>
{
    protected readonly IConfiguration Configuration;

    public LS_DbContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to mysql with connection string from app settings
        var connectionString = Configuration.GetConnectionString("WebApiDatabase");
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    }
    public DbSet<Level> Levels { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Word> Words { get; set; } 
    public DbSet<Quote> Quotes { get; set; }
    public DbSet<Badge> Badges { get; set; }
    public DbSet<BadgeNumber> BadgeNumbers { get; set; }
}