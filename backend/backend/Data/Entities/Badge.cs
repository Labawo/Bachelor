namespace backend.Data.Entities;

public class Badge
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Descripotion { get; set; }
    public BadgeType Type { get; set; }
    public int? QuizXp { get; set; }
    public int? WPM { get; set; }
    public int? TrainingXp { get; set; }
    public string? TrainingType { get; set; }
    public string? BadgeImage { get; set; }
}