using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using backend.Auth.Models;
using backend.Data;
using backend.Data.Dtos.Notes;
using backend.Data.Entities;
using backend.Data.Repositories;

namespace backend.Controllers;

[ApiController]
[Route("api/notes")]
public class NotesController : ControllerBase
{
    private readonly INotesRepository _notesRepository;
    private readonly IAuthorizationService _authorizationService;

    public NotesController(INotesRepository notesRepository, IAuthorizationService authorizationService)
    {
        _notesRepository = notesRepository;
        _authorizationService = authorizationService;
    }
    
    [HttpGet(Name = "GetNotes")]
    public async Task<IEnumerable<NoteDto>> GetManyPaging([FromQuery] NoteSearchParameters searchParameters)
    {
        var notes = await _notesRepository.GetManyAsync(searchParameters, User.FindFirstValue(JwtRegisteredClaimNames.Sub));

        var previousPageLink = notes.HasPrevious
            ? CreateNotesResourceUri(searchParameters,
                RecourceUriType.PreviousPage)
            : null;
        
        var nextPageLink = notes.HasNext
            ? CreateNotesResourceUri(searchParameters,
                RecourceUriType.NextPage)
            : null;

        var paginationMetaData = new
        {
            totalCount = notes.TotalCount,
            pageSize = notes.PageSize,
            currentPage = notes.CurrentPage,
            totalPages = notes.TotalPages,
            previousPageLink,
            nextPageLink
        };

        if (paginationMetaData != null && !Response.Headers.ContainsKey("Pagination"))
        {
            // Add pagination metadata to response header
            Response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationMetaData));
        }

        return notes.Select(o => new NoteDto(o.Id, o.Name, o.Content, o.OwnerId));
    }

    private IEnumerable<LinkDto> CreateLinksForNotes(int noteId)
    {
        yield return new LinkDto{ Href = Url.Link("GetNote", new {noteId}), Rel = "self", Method = "GET"};
        yield return new LinkDto{ Href = Url.Link("DeleteNote", new {noteId}), Rel = "delete_topic", Method = "DELETE"};
    }

    private string? CreateNotesResourceUri(NoteSearchParameters noteSearchParameters, RecourceUriType type)
    {
        return type switch
        {
            RecourceUriType.PreviousPage => Url.Link("GetNotes",
                new
                {
                    pageNumber = noteSearchParameters.PageNumber - 1,
                    pageSize = noteSearchParameters.PageSize,
                }),
            RecourceUriType.NextPage => Url.Link("GetNotes",
                new
                {
                    pageNumber = noteSearchParameters.PageNumber + 1,
                    pageSize = noteSearchParameters.PageSize,
                }),
            _ => Url.Link("GetNotes",
                new
                {
                    pageNumber = noteSearchParameters.PageNumber,
                    pageSize = noteSearchParameters.PageSize,
                })
        };
    }
}