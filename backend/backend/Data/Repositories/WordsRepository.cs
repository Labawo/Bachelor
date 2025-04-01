using backend.Data.Dtos.Levels;
using backend.Data.Dtos.Words;
using Microsoft.EntityFrameworkCore;
using backend.Data.Entities;
using backend.Helpers;

namespace backend.Data.Repositories;

public interface IWordsRepository
{
    Task<Word?> GetAsync(int levelId, int wordId);
    Task<IReadOnlyList<Word>> GetManyAsync(int levelId);
    Task<PagedList<Word>> GetManyAsync(int levelId, WordSearchParameters wordSearchParameters);
    Task CreateAsync(Word word);
    Task CreateManyAsync(List<Word> words);
    Task UpdateAsync(Word word);
    Task RemoveAsync(Word word);
}

public class WordsRepository : IWordsRepository
{
    private readonly LS_DbContext _lsDbContext;

    public WordsRepository(LS_DbContext lsDbContext)
    {
        _lsDbContext = lsDbContext;
    }

    public async Task<Word?> GetAsync(int levelId, int wordId)
    {
        return await _lsDbContext.Words.FirstOrDefaultAsync(o => o.Id == wordId && o.level.Id == levelId);
    }

    public async Task<IReadOnlyList<Word>> GetManyAsync(int levelId)
    {
        return await _lsDbContext.Words.Where(o => o.level.Id == levelId).ToListAsync();
    }

    public async Task<PagedList <Word>> GetManyAsync(int levelId, WordSearchParameters wordSearchParameters)
    {
        var queryable = _lsDbContext.Words.Where(o => o.level.Id == levelId).AsQueryable().OrderBy(o => o.Id);
    
        return await PagedList<Word>.CreateAsync(queryable, wordSearchParameters.PageNumber, wordSearchParameters.PageSize);
    }

    public async Task CreateAsync(Word word)
    {
        _lsDbContext.Words.Add(word);
        await _lsDbContext.SaveChangesAsync();
    }
    
    public async Task CreateManyAsync(List<Word> words)
    {
        _lsDbContext.Words.AddRange(words);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Word word)
    {
        _lsDbContext.Words.Update(word);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task RemoveAsync(Word word)
    {
        _lsDbContext.Words.Remove(word);
        await _lsDbContext.SaveChangesAsync();
    }
}