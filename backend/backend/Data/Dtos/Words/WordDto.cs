namespace backend.Data.Dtos.Words;

public record WordDto(int Id, string Name, string Description, string DoctorId);
public record CreateWordDto(string Name, string Description, string? DoctorId, string? ImageData);
public record UpdateWordDto(string Name, string Description, string? ImageData);