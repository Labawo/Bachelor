using backend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories;

public interface IBadgesRepository
{
    Task<Badge?> GetAsync(int badgeId);
    Task<IReadOnlyList<Badge>> GetManyAsync();
    Task<IReadOnlyList<Badge>> GetManyTrainingAsync(int score, string type);
    Task<IReadOnlyList<Badge>> GetManyQuizAsync(int score);
    Task<IReadOnlyList<Badge>> GetManyQuotesAsync(int score);
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

    public async Task<IReadOnlyList<Badge>> GetManyTrainingAsync(int score, string type)
    {
        return await _lsDbContext.Badges.Where(o => o.Type == BadgeType.Training && o.TrainingXp <= score && o.TrainingType == type).ToListAsync();
    }

    public async Task<IReadOnlyList<Badge>> GetManyQuizAsync(int score)
    {
        return await _lsDbContext.Badges.Where(o => o.Type == BadgeType.Quiz && o.QuizXp <= score).ToListAsync();
    }

    public async Task<IReadOnlyList<Badge>> GetManyQuotesAsync(int score)
    {
        return await _lsDbContext.Badges.Where(o => o.Type == BadgeType.Quote && o.WPM <= score).ToListAsync();
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