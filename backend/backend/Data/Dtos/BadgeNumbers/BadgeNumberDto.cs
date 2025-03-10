namespace backend.Data.Dtos.BadgeNumbers;

public record BadgeNumberDto(int Id, string Name, int ItemCount, int MinExperience, bool IsForWords);
public record CreateBadgeNumberDto(string Name, int MinExperience, bool IsForWords);
public record UpdateBadgeNumberDto(string Name, int MinExperience);