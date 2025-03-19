using backend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public interface IBadgeNumbersRepository
{
    Task<BadgeNumber?> GetAsync(int badgeNumberId);
    Task<IReadOnlyList<BadgeNumber>> GetManyAsync();
    Task<IReadOnlyList<BadgeNumber>> GetManyUserAsync(string userId);
    Task CreateAsync(BadgeNumber badgeNumber);
    Task CreateRangeAsync(List<BadgeNumber> badgeNumber);
    Task UpdateAsync(BadgeNumber badgeNumber);
    Task RemoveAsync(BadgeNumber badgeNumber);
}

public class BadgeNumbersRepository : IBadgeNumbersRepository
{
    private readonly LS_DbContext _lsDbContext;

    public BadgeNumbersRepository(LS_DbContext lsDbContext)
    {
        _lsDbContext = lsDbContext;
    }

    public async Task<BadgeNumber?> GetAsync(int badgeNumberId)
    {
        return await _lsDbContext.BadgeNumbers.FirstOrDefaultAsync(o => o.BadgeId == badgeNumberId);
    }

    public async Task<IReadOnlyList<BadgeNumber>> GetManyAsync()
    {
        return await _lsDbContext.BadgeNumbers.ToListAsync();
    }

    public async Task<IReadOnlyList<BadgeNumber>> GetManyUserAsync(string userId)
    {
        return await _lsDbContext.BadgeNumbers.Where(o => o.OwnerId == userId).ToListAsync();
    }

    public async Task CreateAsync(BadgeNumber badgeNumber)
    {
        _lsDbContext.BadgeNumbers.Add(badgeNumber);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task CreateRangeAsync(List<BadgeNumber> numbers)
    {
        _lsDbContext.BadgeNumbers.AddRange(numbers);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(BadgeNumber badgeNumber)
    {
        _lsDbContext.BadgeNumbers.Update(badgeNumber);
        await _lsDbContext.SaveChangesAsync();
    }

    public async Task RemoveAsync(BadgeNumber badgeNumber)
    {
        _lsDbContext.BadgeNumbers.Remove(badgeNumber);
        await _lsDbContext.SaveChangesAsync();
    }
}