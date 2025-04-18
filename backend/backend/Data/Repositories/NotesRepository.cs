using Microsoft.EntityFrameworkCore;
using backend.Data.Dtos.Notes;
using backend.Data.Entities;
using backend.Helpers;

namespace backend.Data.Repositories;

public interface INotesRepository
{
    Task<Note?> GetAsync(int noteId);
    Task<PagedList<Note>> GetManyAsync(NoteSearchParameters noteSearchParameters, string ownerId);
    Task<IReadOnlyList<Note>> GetManyAsync();
    Task CreateAsync(Note note);
    Task UpdateAsync(Note note);
    Task RemoveAsync(Note note);
}

public class NotesRepository : INotesRepository
{
    private readonly LS_DbContext _lsDbContext;
    
    public NotesRepository(LS_DbContext lsDbContext)
    {
        _lsDbContext = lsDbContext;
    }

    public async Task<Note?> GetAsync(int noteId)
    {
        return await _lsDbContext.Notes.FirstOrDefaultAsync(o => o.Id == noteId);
    }
    
    public async Task<PagedList <Note>> GetManyAsync(NoteSearchParameters noteSearchParameters, string ownerId)
    {
        var queryable = _lsDbContext.Notes.AsQueryable().Where(o => o.OwnerId == ownerId).OrderByDescending(o => o.Time);
        
        return await PagedList<Note>.CreateAsync(queryable, noteSearchParameters.PageNumber, noteSearchParameters.PageSize);
    }

    public async Task<IReadOnlyList<Note>> GetManyAsync()
    {
        return await _lsDbContext.Notes.ToListAsync();
    }

    public async Task CreateAsync(Note note)
    {
        _lsDbContext.Notes.Add(note);
        await _lsDbContext.SaveChangesAsync();
    }
    
    public async Task UpdateAsync(Note note)
    {
        _lsDbContext.Notes.Update(note);
        await _lsDbContext.SaveChangesAsync();
    }
    
    public async Task RemoveAsync(Note note)
    {
        _lsDbContext.Notes.Remove(note);
        await _lsDbContext.SaveChangesAsync();
    }
}