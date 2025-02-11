namespace backend.Data.Dtos.Levels;

public record LevelDto(int Id, string Name, string Description, string DoctorId);
public record CreateLevelDto(string Name, string Description, string? DoctorId, string? ImageData);
public record UpdateLevelDto(string Name, string Description, string? ImageData);