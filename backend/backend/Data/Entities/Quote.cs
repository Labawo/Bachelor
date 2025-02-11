namespace backend.Data.Entities;

public class Quote
{
    public int Id { get; set; }
    public DateTime Time { get; set; }
    public string Content { get; set; }
    public string Source { get; set; }
    public string Author { get; set; }
    public Level level { get; set; }
}