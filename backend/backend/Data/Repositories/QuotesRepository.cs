using backend.Data.Dtos.Quotes;
using backend.Data.Entities;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public interface IQuotesRepository
{
    Task<Quote?> GetAsync(int levelId, int quoteId);
    Task<Quote?> GetRandomAsync(int levelId);
    Task<IReadOnlyList<Quote>> GetManyAsync(int levelId);
    Task<PagedList<Quote>> GetManyAsync(int levelId, QuoteSearchParameters quoteSearchParameters);
    Task CreateAsync(Quote quote);
    Task UpdateAsync(Quote quote);
    Task RemoveAsync(Quote quote);
}

public class QuotesRepository : IQuotesRepository
{
    private readonly LS_DbContext _lsDbContext;

    public QuotesRepository(LS_DbContext lsDbContext)
    {
        _lsDbContext = lsDbContext;
    }

    public async Task<Quote?> GetAsync(int levelId, int quoteId)
    {
        return await _lsDbContext.Quotes.FirstOrDefaultAsync(o => o.Id == quoteId && o.level.Id == levelId);
    }

    public async Task<Quote?> GetRandomAsync(int levelId)
    {
        Random random = new Random();
        int toSkip = random.Next(_lsDbContext.Quotes.Where(o => o.level.Id == levelId).Count());

        return await _lsDbContext.Quotes.Skip(toSkip).Take(1).FirstOrDefaultAsync();
    }

    public async Task<IReadOnlyList<Quote>> GetManyAsync(int levelId)
    {
        return await _lsDbContext.Quotes.Where(o => o.level.Id == levelId).ToListAsync();
    }

    public async Task<PagedList <Quote>> GetManyAsync(int levelId, QuoteSearchParameters quoteSearchParameters)
    {
        var queryable = _lsDbContext.Quotes.Where(o => o.level.Id == levelId).AsQueryable().OrderBy(o => o.Source);
    
        return await PagedList<Quote>.CreateAsync(queryable, quoteSearchParameters.PageNumber, quoteSearchParameters.PageSize);
    }

    public async Task CreateAsync(Quote quote)
    {
        _lsDbContext.Quotes.Add(quote);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Quote quote)
    {
        _lsDbContext.Quotes.Update(quote);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task RemoveAsync(Quote quote)
    {
        _lsDbContext.Quotes.Remove(quote);
        await _lsDbContext.SaveChangesAsync();
    }
}