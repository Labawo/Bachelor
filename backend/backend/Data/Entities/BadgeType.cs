using System.ComponentModel;

namespace backend.Data.Entities;

public enum BadgeType
{
    [Description("Quiz Badge")]
    Quiz = 1,
    [Description("Quote Badge")]
    Quote = 2,
    [Description("Training Badge")]
    Training = 3
}