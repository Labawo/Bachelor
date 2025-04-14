namespace backend.Data.Dtos.BadgeNumbers;

public record BadgeNumberDto(int Id, string Name, int ItemCount, int MinExperience, bool IsForWords);
public record CreateTrainingResultDto(int Points, string TrainingType);
public record CreateQuizResultDto(int Points, string type);
public record CreateQuoteResultDto(int Points, int WPM, bool Single);
public record UpdateBadgeNumberDto(string Name, int MinExperience);