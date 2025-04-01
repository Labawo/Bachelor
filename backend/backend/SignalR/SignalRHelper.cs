using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.SignalR;

public static class SignalRHelper
{
    public static bool ValidateToken(string token, string issuer, string audience)
    {
        var signingKeys = new List<SecurityKey>();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("123456789zxcvbnmasdfghjklqwertyu"));
        signingKeys.Add(key);
        
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudience = audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKeys = signingKeys,
            ValidateLifetime = true
        };

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

            return true;
        }
        catch (SecurityTokenValidationException ex)
        {
            return false;
        }
    }
}