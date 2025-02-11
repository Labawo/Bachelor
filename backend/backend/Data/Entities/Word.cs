namespace backend.Data.Entities;

public class Word
{
    public int Id { get; set; }
    public DateTime Time { get; set; }
    public string Content { get; set; }
    public Level level { get; set; }
}