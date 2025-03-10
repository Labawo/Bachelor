using backend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public interface IBadgesRepository
{
    Task<Badge?> GetAsync(int badgeId);
    Task<IReadOnlyList<Badge>> GetManyAsync();
    Task CreateAsync(Badge badge);
    Task UpdateAsync(Badge badge);
    Task RemoveAsync(Badge badge);
}

public class BadgesRepository : IBadgesRepository
{
    private readonly LS_DbContext _lsDbContext;

    public BadgesRepository(LS_DbContext lsDbContext)
    {
        _lsDbContext = lsDbContext;
    }

    public async Task<Badge?> GetAsync(int badgeId)
    {
        return await _lsDbContext.Badges.FirstOrDefaultAsync(o => o.Id == badgeId);
    }

    public async Task<IReadOnlyList<Badge>> GetManyAsync()
    {
        return await _lsDbContext.Badges.ToListAsync();
    }

    public async Task CreateAsync(Badge badge)
    {
        _lsDbContext.Badges.Add(badge);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Badge badge)
    {
        _lsDbContext.Badges.Update(badge);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task RemoveAsync(Badge badge)
    {
        _lsDbContext.Badges.Remove(badge);
        await _lsDbContext.SaveChangesAsync();
    }
}