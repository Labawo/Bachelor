using System.Collections;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using backend.Auth.Models;
using backend.Data;
using backend.Data.Dtos.Quotes;
using backend.Data.Repositories;
using backend.Data.Entities;

namespace backend.Controllers;

[ApiController]
[Route("api/levels/{levelId}/quotes")]
public class QuotesController : ControllerBase
{
    private readonly UserManager<SiteUser> _userManager;
    private readonly ILevelsRepository _levelsRepository;
    private readonly IQuotesRepository _quotesRepository;
    private readonly IAuthorizationService _authorizationService;

    public QuotesController(UserManager<SiteUser> userManager, IQuotesRepository quotesRepository,
        ILevelsRepository levelsRepository, IAuthorizationService authorizationService)
    {
        _userManager = userManager;
        _quotesRepository = quotesRepository;
        _levelsRepository = levelsRepository;
        _authorizationService = authorizationService;
    }

    [HttpGet(Name = "GetQuotes")]
    public async Task<IEnumerable<QuoteDto>> GetManyPaging(int levelId, [FromQuery] QuoteSearchParameters searchParameters)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return new List<QuoteDto>();

        var quotes = await _quotesRepository.GetManyAsync(level.Id, searchParameters);

        var previousPageLink = quotes.HasPrevious
            ? CreateQuotesResourceUri(searchParameters,
                RecourceUriType.PreviousPage)
            : null;
        
        var nextPageLink = quotes.HasNext
            ? CreateQuotesResourceUri(searchParameters,
                RecourceUriType.NextPage)
            : null;

        var paginationMetaData = new
        {
            totalCount = quotes.TotalCount,
            pageSize = quotes.PageSize,
            currentPage = quotes.CurrentPage,
            totalPages = quotes.TotalPages,
            previousPageLink,
            nextPageLink
        };

        if (paginationMetaData != null && !Response.Headers.ContainsKey("Pagination"))
        {
            // Add pagination metadata to response header
            Response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationMetaData));
        }

        return quotes.Select(o => new QuoteDto(o.Id, o.Content, o.Source, o.Author, o.TimeToComplete));
    }
    
    [HttpGet("{quoteId}", Name = "GetQuote")]
    public async Task<ActionResult<QuoteDto>> Get(int levelId, int quoteId)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");

        var quote = await _quotesRepository.GetAsync(level.Id, quoteId);
        if (quote == null) return NotFound();

        var links = CreateLinksForQuotes(quoteId);

        var quoteDto = new QuoteDto(quote.Id, quote.Content, quote.Source, quote.Author, quote.TimeToComplete);
        
        return Ok(new { Resource = quoteDto, Links = links});
    }

    [HttpPost]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<QuoteDto>> Create(int levelId, CreateQuoteDto quoteDto)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, level, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var quote = new Quote { Content = quoteDto.Content, Author = quoteDto.Author, Source = quoteDto.Source };
        quote.TimeToComplete = quoteDto.TimeToComplete;
        quote.ItemNumber = 0;
        quote.level = level;
        quote.LevelId = level.Id;

        await _quotesRepository.CreateAsync(quote);

        return Created("GetQuote",
            new QuoteDto(quote.Id, quote.Content, quote.Source, quote.Author, quote.TimeToComplete));
    }

    [HttpPut("{quoteId}")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<QuoteDto>> Update(int levelId, int quoteId,
        UpdateQuoteDto updateQuoteDto)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, level, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var oldQuote = await _quotesRepository.GetAsync(levelId, quoteId);
        
        if (oldQuote == null)
            return NotFound();
        
        oldQuote.Content = updateQuoteDto.Content;
        oldQuote.Source = updateQuoteDto.Source;
        oldQuote.Author = updateQuoteDto.Author;
        oldQuote.TimeToComplete = updateQuoteDto.TimeToComplete;

        await _quotesRepository.UpdateAsync(oldQuote);

        return Ok(new QuoteDto(oldQuote.Id, oldQuote.Content, oldQuote.Source, oldQuote.Author, oldQuote.TimeToComplete));
    }

    [HttpDelete("{quoteId}")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult> Remove(int levelId, int quoteId)
    {
        var level = await _levelsRepository.GetAsync(quoteId);
        if (level == null) return NotFound($"Couldn't find a level with id of {quoteId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, level, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var quote = await _quotesRepository.GetAsync(levelId, quoteId);
        
        if (quote == null)
            return NotFound();

        await _quotesRepository.RemoveAsync(quote);

        // 204
        return NoContent();
    }
    
    private IEnumerable<LinkDto> CreateLinksForQuotes(int quoteId)
    {
        yield return new LinkDto{ Href = Url.Link("GetQuote", new {quoteId}), Rel = "self", Method = "GET"};
        yield return new LinkDto{ Href = Url.Link("DeleteQuote", new {quoteId}), Rel = "delete_topic", Method = "DELETE"};
    }

    private string? CreateQuotesResourceUri(QuoteSearchParameters quoteSearchParameters, RecourceUriType type)
    {

        return type switch
        {
            RecourceUriType.PreviousPage => Url.Link("GetQuotes",
                new
                {
                    pageNumber = quoteSearchParameters.PageNumber - 1,
                    pageSize = quoteSearchParameters.PageSize,
                }),
            RecourceUriType.NextPage => Url.Link("GetQuotes",
                new
                {
                    pageNumber = quoteSearchParameters.PageNumber + 1,
                    pageSize = quoteSearchParameters.PageSize,
                }),
            _ => Url.Link("GetQuotes",
                new
                {
                    pageNumber = quoteSearchParameters.PageNumber,
                    pageSize = quoteSearchParameters.PageSize,
                })
        };
    }
}