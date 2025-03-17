namespace backend.Data.Dtos.Badges;

public record BadgeDto(int Id, string Name, string Description);
public record BadgeImageDto(int Id, string Name, string Description, string? Image);
public record CreateBadgeDto(string Name, string Description, string? Image, string Type, string? TrainingType, int? TrainingXp, int? QuizXp, int? WPM);
public record UpdateBadgeDto(string Name, string Description, string? BadgeImage);