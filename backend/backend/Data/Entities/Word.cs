namespace backend.Data.Entities;

public class Word
{
    public int Id { get; set; }
    public string Question { get; set; }
    public string CorrectAnswer { get; set; }
    public bool IsOpen { get; set; }
    public int LevelId { get; set; }
    public string? ImageData { get; set; }
    public string? Choices { get; set; }
    public Level level { get; set; }
}