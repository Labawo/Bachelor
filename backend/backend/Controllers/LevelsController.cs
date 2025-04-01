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
using backend.Data.Dtos.Badges;
using backend.Data.Dtos.Quotes;
using backend.Data.Dtos.Words;

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
    
    
    [HttpGet("forWords")]
    public async Task<IEnumerable<LevelDto>> GetManyPagingForWords([FromQuery] LevelSearchParameters searchParameters)
    {
        var levels = await _levelsRepository.GetManyForWordsAsync(searchParameters);

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
    
    [HttpGet("notForWords")]
    public async Task<IEnumerable<LevelDto>> GetManyPagingNotForWords([FromQuery] LevelSearchParameters searchParameters)
    {
        var levels = await _levelsRepository.GetManyNotForWordsAsync(searchParameters);

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

    [HttpGet("test/{testId}")]
    public async Task<ActionResult<LevelDto>> GetTestId(int testId)
    {
        return Ok(testId);
    }

    [HttpGet("quizes")]
    public async Task<IEnumerable<LevelDto>> GetManyUserQuizPaging([FromQuery] LevelSearchParameters searchParameters)
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return new List<LevelDto>();
        }

        int userScore = user.QuizXp == null ? 0 : (int)user.QuizXp;

        var levels = await _levelsRepository.GetManyQuizAsync(searchParameters, userScore);

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

    [HttpGet("quotes")]
    public async Task<IEnumerable<LevelDto>> GetManyUserQuotesPaging([FromQuery] LevelSearchParameters searchParameters)
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return new List<LevelDto>();
        }

        int userScore = user.XP == null ? 0 : (int)user.XP;
        
        var levels = await _levelsRepository.GetManyQuoteAsync(searchParameters, userScore);

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

    [HttpGet("quotes/{quoteId}/randomQuote")]
    public async Task<ActionResult<QuoteDto>> GetUserQuote(int quoteId)
    {
        var level = await _levelsRepository.GetAsync(quoteId);

        if(level == null)
        {
            return BadRequest();
        }

        var quote = await _quotesRepository.GetRandomAsync(level.Id);
        if (quote == null) return NotFound();

        var quoteDto = new QuoteDto(quote.Id, quote.Content, quote.Source, quote.Author, quote.TimeToComplete);

        return Ok(quoteDto);
    }

    [HttpGet("quizes/{quizId}")]
    public async Task<IEnumerable<WordDto>> GetUserQuiz(int quizId)
    {
        var level = await _levelsRepository.GetAsync(quizId);

        if (level == null)
        {
            return new List<WordDto>();
        }

        var quiz = await _wordsRepository.GetManyAsync(level.Id);

        var random = new Random();

        var randomLevels = quiz.OrderBy(o => random.Next(quiz.Count()));

        return randomLevels.Select(o => new WordDto(o.Id, o.Question, o.IsOpen, o.CorrectAnswer, o.Choices, o.ImageData));
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
        if (createLevelDto.Name.Length == 0)
        {
            return BadRequest("Lygio pavadinimas negali būti tuščias.");
        }
        
        if (createLevelDto.Name.IndexOfAny("*&#<>/".ToCharArray()) != -1)
        {
            return BadRequest("Įvesti negalimi simboliai.");
        }

        if (createLevelDto.MinExperience < 0)
        {
            return BadRequest("Negalima patirtis mažiau nulio.");
        }
        
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
        
        if (updateLevelDto.Name.Length == 0)
        {
            return BadRequest("Lygio pavadinimas negali būti tuščias.");
        }
        
        if (updateLevelDto.Name.IndexOfAny("*&#<>/".ToCharArray()) != -1)
        {
            return BadRequest("Įvesti negalimi simboliai.");
        }

        if (updateLevelDto.MinExperience < 0)
        {
            return BadRequest("Negalima patirtis mažiau nulio.");
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

        switch (level.IsForWords)
        {
            case true:
            {
                var words = await _wordsRepository.GetManyAsync(levelId);

                if (words.Count > 0)
                {
                    return Forbid();
                }

                break;
            }
            case false:
            {
                var quotes = await _quotesRepository.GetManyAsync(levelId);

                if (quotes.Count > 0)
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