namespace backend.Data.Dtos.Quotes;

public record QuoteDto(int Id, string Content, string Source, string Author, int TimeToComplete);
public record CreateQuoteDto(string Content, string Source, string Author, int TimeToComplete);
public record UpdateQuoteDto(string Content, string Source, string Author, int TimeToComplete);