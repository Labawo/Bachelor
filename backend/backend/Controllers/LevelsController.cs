using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using backend.Auth.Models;
using backend.Data;
using backend.Data.Dtos.Levels;
using backend.Data.Entities;
using backend.Data.Repositories;

namespace backend.Controllers;

[ApiController]
[Route("api/levels")]
public class LevelsController : ControllerBase
{
    private readonly UserManager<SiteUser> _userManager;
    private readonly  ILevelsRepository _levelsRepository;
    private readonly IWordsRepository _wordsRepository;
    private readonly IQuotesRepository _quotesRepository;
    private readonly IAuthorizationService _authorizationService;

    public LevelsController(UserManager<SiteUser> userManager, ILevelsRepository levelsRepository, IWordsRepository wordsRepository, IQuotesRepository quotesRepository, IAuthorizationService authorizationService)
    {
        _userManager = userManager;
        _levelsRepository = levelsRepository;
        _authorizationService = authorizationService;
        _wordsRepository = wordsRepository;
        _quotesRepository = quotesRepository;
    }

    [HttpGet(Name = "GetLevels")]
    public async Task<IEnumerable<LevelDto>> GetManyPaging([FromQuery] LevelSearchParameters searchParameters)
    {
        var levels = await _levelsRepository.GetManyAsync(searchParameters);

        var previousPageLink = levels.HasPrevious
            ? CreateLevelsResourceUri(searchParameters,
                RecourceUriType.PreviousPage)
            : null;
        
        var nextPageLink = levels.HasNext
            ? CreateLevelsResourceUri(searchParameters,
                RecourceUriType.NextPage)
            : null;

        var paginationMetaData = new
        {
            totalCount = levels.TotalCount,
            pageSize = levels.PageSize,
            currentPage = levels.CurrentPage,
            totalPages = levels.TotalPages,
            previousPageLink,
            nextPageLink
        };

        if (paginationMetaData != null && !Response.Headers.ContainsKey("Pagination"))
        {
            // Add pagination metadata to response header
            Response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationMetaData));
        }

        return levels.Select(o => new LevelDto(o.Id, o.Name, o.ItemCount, o.MinExperience, o.IsForWords));
    }
    
    [HttpGet("{levelId}", Name = "GetLevel")]
    public async Task<ActionResult<LevelDto>> Get(int levelId)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        
        //404
        if (level == null)
        {
            return NotFound();
        }

        var links = CreateLinksForLevels(levelId);

        var levelDto = new LevelDto(level.Id, level.Name, level.ItemCount, level.MinExperience, level.IsForWords);
        
        return Ok(new { Resource = levelDto, Links = links});
    }

    [HttpPost]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<LevelDto>> Create(CreateLevelDto createLevelDto)
    {
        var level = new Level
        {
            Name = createLevelDto.Name,
            MinExperience = createLevelDto.MinExperience,
            IsForWords = createLevelDto.IsForWords,
        };

        level.ItemCount = 0;

        await _levelsRepository.CreateAsync(level);

        //201
        return Created("", new LevelDto(level.Id, level.Name, level.ItemCount, level.MinExperience, level.IsForWords));
    }


    [HttpPut]
    [Route("{levelId}")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<LevelDto>> Update(int levelId, UpdateLevelDto updateLevelDto)
    {
        var level = await _levelsRepository.GetAsync(levelId);

        if (level == null)
        {
            return NotFound();
        }

        level.Name = updateLevelDto.Name;
        level.MinExperience = updateLevelDto.MinExperience; 

        await _levelsRepository.UpdateAsync(level);

        return Ok(new LevelDto(level.Id, level.Name, level.ItemCount, level.MinExperience, level.IsForWords));
    }


    [HttpDelete("{levelId}", Name = "DeleteLevel")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult> Remove(int levelId)
    {
        var level = await _levelsRepository.GetAsync(levelId);

        if (level == null)
        {
            return NotFound();
        }
        
        var authorizationResult = await _authorizationService.AuthorizeAsync(User, level, PolicyNames.ResourceOwner);

        switch (level.IsForWords)
        {
            case true:
            {
                var words = await _wordsRepository.GetManyAsync(levelId);

                if (!authorizationResult.Succeeded || words.Count > 0)
                {
                    return Forbid();
                }

                break;
            }
            case false:
            {
                var quotes = await _quotesRepository.GetManyAsync(levelId);

                if (!authorizationResult.Succeeded || quotes.Count > 0)
                {
                    return Forbid();
                }

                break;
            }
        }

        await _levelsRepository.RemoveAsync(level);
        
        //204
        return NoContent();
    }

    private IEnumerable<LinkDto> CreateLinksForLevels(int levelId)
    {
        yield return new LinkDto{ Href = Url.Link("GetLevel", new {levelId}), Rel = "self", Method = "GET"};
        yield return new LinkDto{ Href = Url.Link("DeleteLevel", new {levelId}), Rel = "delete_topic", Method = "DELETE"};
    }

    private string? CreateLevelsResourceUri(LevelSearchParameters levelSearchParameters, RecourceUriType type)
    {

        return type switch
        {
            RecourceUriType.PreviousPage => Url.Link("GetLevels",
                new
                {
                    pageNumber = levelSearchParameters.PageNumber - 1,
                    pageSize = levelSearchParameters.PageSize,
                }),
            RecourceUriType.NextPage => Url.Link("GetLevels",
                new
                {
                    pageNumber = levelSearchParameters.PageNumber + 1,
                    pageSize = levelSearchParameters.PageSize,
                }),
            _ => Url.Link("GetLevels",
                new
                {
                    pageNumber = levelSearchParameters.PageNumber,
                    pageSize = levelSearchParameters.PageSize,
                })
        };
    }
}