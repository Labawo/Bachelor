using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.JsonWebTokens;
using backend.Auth.Models;

namespace backend.Auth;

public class ResourceOwnerAuthorizationHandler: AuthorizationHandler<ResourceOwnerRequirement, IUserOwnedResource>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ResourceOwnerRequirement requirement,
        IUserOwnedResource resource)
    {
        if (context.User.IsInRole(SiteRoles.Admin) ||
            context.User.FindFirstValue(JwtRegisteredClaimNames.Sub) == resource.OwnerId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

public record ResourceOwnerRequirement : IAuthorizationRequirement;