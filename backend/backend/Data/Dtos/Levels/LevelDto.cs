namespace backend.Data.Dtos.Levels;

public record LevelDto(int Id, string Name, int ItemCount, int MinExperience, bool IsForWords);
public record LevelWithDescriptionDto(int Id, string Name,string? Description, int ItemCount, int MinExperience, bool IsForWords);
public record CreateLevelDto(string Name, string? Description, int MinExperience, bool IsForWords);
public record UpdateLevelDto(string Name, string? Description, int MinExperience);