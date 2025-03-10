namespace backend.Data.Dtos.Levels;

public class LevelSearchParameters
{
    private int _pageSize = 4;
    private const int MaxPageSize = 50;

    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}