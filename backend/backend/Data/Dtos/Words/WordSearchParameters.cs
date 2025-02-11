namespace backend.Data.Dtos.Words;

public class WordSearchParameters
{
    private int _pageSize = 25;
    private const int MaxPageSize = 50;

    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}