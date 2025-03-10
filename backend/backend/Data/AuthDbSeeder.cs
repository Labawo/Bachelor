using backend.Auth.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Data;

public class AuthDbSeeder
{
    private readonly UserManager<SiteUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthDbSeeder(UserManager<SiteUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        await AddDefaultRoles();
        await AddAdminUser();
    }

    private async Task AddAdminUser()
    {
        var newAdminUser = new SiteUser
        {
            UserName = "admin",
            Email = "admin@admin.com",
            EmailConfirmed = true
        };

        var existingAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
    
        if (existingAdminUser == null)
        {
            var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, password: "VeriSafePassword1!");

            if (createAdminUserResult.Succeeded)
            {
                await _userManager.AddToRolesAsync(newAdminUser, SiteRoles.All);
            }
        }
    }

    private async Task AddDefaultRoles()
    {
        foreach (var role in SiteRoles.All)
        {
            var roleExists = await _roleManager.RoleExistsAsync(role);
            if (!roleExists)
                await _roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}