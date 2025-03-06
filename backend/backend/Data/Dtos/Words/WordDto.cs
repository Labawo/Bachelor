namespace backend.Data.Dtos.Words;

public record WordDto(int Id, string Question, bool IsOpen, string CorrectAnswer, string? Choices, string? ImageData);
public record CreateWordDto(string Question, bool IsOpen, string CorrectAnswer, string? Choices, string? ImageData);
public record UpdateWordDto(string Question, string CorrectAnswer, string? Choices, string? ImageData);