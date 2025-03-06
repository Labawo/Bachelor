namespace backend.Data.Entities;

public class Quote
{
    public int Id { get; set; }
    public int ItemNumber { get; set; }
    public string Content { get; set; }
    public string Source { get; set; }
    public string Author { get; set; }
    public int TimeToComplete { get; set; }
    public int LevelId { get; set; } 
    public Level level { get; set; }
}