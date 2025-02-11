namespace backend.Data.Dtos.Quotes;

public record QuoteDto(int Id, string Name, string Description, string DoctorId);
public record CreateQuoteDto(string Name, string Description, string? DoctorId, string? ImageData);
public record UpdateQuoteDto(string Name, string Description, string? ImageData);