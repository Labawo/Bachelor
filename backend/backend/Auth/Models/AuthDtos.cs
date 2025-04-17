using System.ComponentModel.DataAnnotations;
using Azure.Identity;

namespace backend.Auth.Models;

public record RegisterUserDto([Required] string UserName, [EmailAddress][Required] string Email, [Required] string Password);
public record LoginDto(string UserName, string Password);
public record UserDto(string Id, string? UserName, string? Email, DateTime? RegistrationDate, bool EmailConfirmed);

public record UserWithConfimationLinkDto(string Id, string? UserName, string? Email, string? ConfimationLink);

public record SuccessfulLoginDto(string AccessToken, string RefreshToken);

public record RefreshAccessTokenDto(string RefreshToken);

public record ChangePasswordDto([Required]string NewPassword);

public record ResetPasswordDto([Required] string CurrentPassword, [Required] string NewPassword);

public record UpdateProfileDto([Required] string Name, [Required] string LastName);

public record UserTopDto(string UserName, int? BadgeCount, int? FirstRegistrationYear);

public record UserStatisticsDto(int? BadgeCount, int? WPM, int? QuizDone, int? QuizXp, int? QuoteXP);