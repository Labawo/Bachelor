using Microsoft.EntityFrameworkCore;
using backend.Data.Dtos.Levels;
using backend.Data.Entities;
using backend.Helpers;

namespace backend.Data.Repositories;

public interface ILevelsRepository
{
    Task<Level?> GetAsync(int levelId);
    Task<IReadOnlyList<Level>> GetManyAsync();
    Task<PagedList<Level>> GetManyAsync(LevelSearchParameters levelSearchParameters);
    Task CreateAsync(Level level);
    Task UpdateAsync(Level level);
    Task RemoveAsync(Level level);
}

public class LevelsRepository : ILevelsRepository
{
    private readonly LS_DbContext _lsDbContext;

    public LevelsRepository(LS_DbContext lsDbContext)
    {
        _lsDbContext = lsDbContext;
    }

    public async Task<Level?> GetAsync(int levelId)
    {
        return await _lsDbContext.Levels.FirstOrDefaultAsync(o => o.Id == levelId);
    }

    public async Task<IReadOnlyList<Level>> GetManyAsync()
    {
        return await _lsDbContext.Levels.ToListAsync();
    }

    public async Task<PagedList <Level>> GetManyAsync(LevelSearchParameters levelSearchParameters)
    {
        var queryable = _lsDbContext.Levels.AsQueryable().OrderBy(o => o.Name);
    
        return await PagedList<Level>.CreateAsync(queryable, levelSearchParameters.PageNumber, levelSearchParameters.PageSize);
    }

    public async Task CreateAsync(Level level)
    {
        _lsDbContext.Levels.Add(level);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Level level)
    {
        _lsDbContext.Levels.Update(level);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task RemoveAsync(Level level)
    {
        _lsDbContext.Levels.Remove(level);
        await _lsDbContext.SaveChangesAsync();
    }
}