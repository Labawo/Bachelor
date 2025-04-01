namespace backend.Data.Dtos.BadgeNumbers;

public record BadgeNumberDto(int Id, string Name, int ItemCount, int MinExperience, bool IsForWords);
public record CreateTrainingResultDto(string OwnerId, int Points, string TrainingType);
public record CreateQuizResultDto(string OwnerId, int Points, string type);
public record CreateQuoteResultDto(string OwnerId, int Points, int WPM, bool Single);
public record UpdateBadgeNumberDto(string Name, int MinExperience);