namespace backend.Data.Dtos.BadgeNumbers;

public record BadgeNumberDto(int Id, string Name, int ItemCount, int MinExperience, bool IsForWords);
public record CreateTrainingDto(string OwnerId, int Points, string TrainingType);
public record CreateQuizDto(string OwnerId, int Points, string type);
public record CreateQuoteDto(string OwnerId, int Points, string type);
public record UpdateBadgeNumberDto(string Name, int MinExperience);