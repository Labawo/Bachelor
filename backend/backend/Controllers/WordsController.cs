using System.Collections;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using backend.Auth.Models;
using backend.Data;
using backend.Data.Dtos.Levels;
using backend.Data.Dtos.Words;
using backend.Data.Repositories;
using backend.Data.Entities;
using System.Text.Json.Nodes;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace backend.Controllers;

[ApiController]
[Route("api/levels/{levelId}/words")]
public class WordsController : ControllerBase
{
    private readonly UserManager<SiteUser> _userManager;
    private readonly ILevelsRepository _levelsRepository;
    private readonly IWordsRepository _wordsRepository;
    private readonly IAuthorizationService _authorizationService;

    public WordsController(UserManager<SiteUser> userManager, IWordsRepository wordsRepository,
        ILevelsRepository levelsRepository, IAuthorizationService authorizationService)
    {
        _userManager = userManager;
        _wordsRepository = wordsRepository;
        _levelsRepository = levelsRepository;
        _authorizationService = authorizationService;
    }

    [HttpGet(Name = "GetWords")]
    public async Task<IEnumerable<WordDto>> GetManyPaging(int levelId, [FromQuery] WordSearchParameters searchParameters)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return new List<WordDto>();

        var words = await _wordsRepository.GetManyAsync(level.Id, searchParameters);

        var previousPageLink = words.HasPrevious
            ? CreateWordsResourceUri(searchParameters,
                RecourceUriType.PreviousPage)
            : null;
        
        var nextPageLink = words.HasNext
            ? CreateWordsResourceUri(searchParameters,
                RecourceUriType.NextPage)
            : null;

        var paginationMetaData = new
        {
            totalCount = words.TotalCount,
            pageSize = words.PageSize,
            currentPage = words.CurrentPage,
            totalPages = words.TotalPages,
            previousPageLink,
            nextPageLink
        };

        if (paginationMetaData != null && !Response.Headers.ContainsKey("Pagination"))
        {
            // Add pagination metadata to response header
            Response.Headers.Add("Pagination", System.Text.Json.JsonSerializer.Serialize(paginationMetaData));
        }

        return words.Select(o => new WordDto(o.Id, o.Question, o.IsOpen, o.CorrectAnswer, o.Choices, o.ImageData));
    }
    
    [HttpGet("{wordId}", Name = "GetWord")]
    public async Task<ActionResult<WordDto>> Get(int levelId, int wordId)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");

        var word = await _wordsRepository.GetAsync(level.Id, wordId);
        if (word == null) return NotFound();

        var links = CreateLinksForWords(wordId);

        var wordDto = new WordDto(word.Id, word.Question, word.IsOpen, word.CorrectAnswer, word.Choices, word.ImageData);
        
        return Ok(new { Resource = wordDto, Links = links});
    }

    [HttpPost]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<WordDto>> Create(int levelId, CreateWordDto wordDto)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, level, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }
        
        var word = new Word { Question = wordDto.Question, IsOpen = wordDto.IsOpen, CorrectAnswer = wordDto.CorrectAnswer };

        if (!word.IsOpen)
        {
            if (wordDto.Choices == null)
            {
                return BadRequest();
            }
            
            word.Choices = wordDto.Choices;
        }

        if (wordDto.ImageData != null)
        {
            word.ImageData = wordDto.ImageData;
        }

        await _wordsRepository.CreateAsync(word);

        return Created("GetWord",
            new WordDto(word.Id, word.Question, word.IsOpen, word.CorrectAnswer, word.Choices, word.ImageData));
    }

    [HttpPost("array")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult> CreateArray(int levelId, JsonArray array)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");
        List<Word> words = new List<Word>();

        foreach (var node in array)
        {
            var obj = node?.AsObject();

            if (obj != null && obj.ContainsKey("question") && obj.ContainsKey("correctAnswer"))
            {
                Word word = new Word { Question = (string)obj["question"], CorrectAnswer = (string)obj["correctAnswer"], LevelId = levelId, IsOpen = true };
                words.Add(word);
            }
        }

        return Ok(words.Count);
    }

    [HttpPut("{wordId}")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<WordDto>> Update(int levelId, int wordId,
        UpdateWordDto updateWordDto)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, level, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var oldWord = await _wordsRepository.GetAsync(levelId, wordId);
        
        if (oldWord == null)
            return NotFound();
        
        oldWord.Question = updateWordDto.Question;
        oldWord.CorrectAnswer = updateWordDto.CorrectAnswer;

        if (oldWord.Choices != null)
        {
            oldWord.Choices = updateWordDto.Choices;
        }
        
        if (oldWord.ImageData != null || updateWordDto.ImageData != null)
        {
            oldWord.ImageData = updateWordDto.ImageData;
        }

        await _wordsRepository.UpdateAsync(oldWord);

        return Ok(new WordDto(oldWord.Id, oldWord.Question, oldWord.IsOpen, oldWord.CorrectAnswer, oldWord.Choices, oldWord.ImageData));
    }

    [HttpDelete("{wordId}")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult> Remove(int levelId, int wordId)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, level, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var word = await _wordsRepository.GetAsync(levelId, wordId);
        
        if (word == null)
            return NotFound();

        await _wordsRepository.RemoveAsync(word);

        // 204
        return NoContent();
    }
    
    private IEnumerable<LinkDto> CreateLinksForWords(int wordId)
    {
        yield return new LinkDto{ Href = Url.Link("GetWord", new {wordId}), Rel = "self", Method = "GET"};
        yield return new LinkDto{ Href = Url.Link("DeleteWord", new {wordId}), Rel = "delete_topic", Method = "DELETE"};
    }

    private string? CreateWordsResourceUri(WordSearchParameters wordSearchParameters, RecourceUriType type)
    {

        return type switch
        {
            RecourceUriType.PreviousPage => Url.Link("GetWords",
                new
                {
                    pageNumber = wordSearchParameters.PageNumber - 1,
                    pageSize = wordSearchParameters.PageSize,
                }),
            RecourceUriType.NextPage => Url.Link("GetWords",
                new
                {
                    pageNumber = wordSearchParameters.PageNumber + 1,
                    pageSize = wordSearchParameters.PageSize,
                }),
            _ => Url.Link("GetWords",
                new
                {
                    pageNumber = wordSearchParameters.PageNumber,
                    pageSize = wordSearchParameters.PageSize,
                })
        };
    }
}