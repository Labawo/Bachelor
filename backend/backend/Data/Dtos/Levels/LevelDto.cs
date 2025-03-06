namespace backend.Data.Dtos.Levels;

public record LevelDto(int Id, string Name, int ItemCount, int MinExperience, bool IsForWords);
public record CreateLevelDto(string Name, int MinExperience, bool IsForWords);
public record UpdateLevelDto(string Name, int MinExperience);