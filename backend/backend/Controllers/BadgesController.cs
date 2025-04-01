using backend.Auth.Models;
using backend.Data.Dtos.Badges;
using backend.Data.Dtos.Levels;
using backend.Data.Entities;
using backend.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/badges")]
public class BadgesController : ControllerBase
{
    private readonly  IBadgesRepository _badgesRepository;
    private readonly IAuthorizationService _authorizationService;

    public BadgesController(IBadgesRepository badgesRepository, IAuthorizationService authorizationService)
    {
        _badgesRepository = badgesRepository;
        _authorizationService = authorizationService;
    }

    [HttpGet(Name = "GetBadges")]
    public async Task<IEnumerable<BadgeDto>> GetMany()
    {
        var badges = await _badgesRepository.GetManyAsync();

        return badges.Select(o => 
            new BadgeDto(
                o.Id, 
                o.Name, 
                o.Descripotion));
    }
    
    [HttpGet("{badgeId}", Name = "GetBadge")]
    public async Task<ActionResult<BadgeDto>> Get(int badgeId)
    {
        var badge = await _badgesRepository.GetAsync(badgeId);
        
        //404
        if (badge == null)
        {
            return NotFound();
        }

        var badgeDto = new BadgeImageDto(badge.Id, badge.Name, badge.Descripotion, badge.BadgeImage);
        
        return Ok(badgeDto);
    }

    [HttpPost]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<Badge>> Create(CreateBadgeDto createBadgeDto)
    {
        if(createBadgeDto.Name.Length == 0 || createBadgeDto.Description.Length == 0 || createBadgeDto.Type.Length == 0)
        {
            return BadRequest();
        }
        
        if (createBadgeDto.Name.IndexOfAny("*&#<>/".ToCharArray()) != -1)
        {
            return BadRequest("Įvesti negalimi simboliai.");
        }
        
        if (createBadgeDto.Description.IndexOfAny("*&#<>/".ToCharArray()) != -1)
        {
            return BadRequest("Įvesti negalimi simboliai.");
        }
        
        if (createBadgeDto.Type.IndexOfAny("*&#<>/".ToCharArray()) != -1)
        {
            return BadRequest("Įvesti negalimi simboliai.");
        }
        
        if (createBadgeDto.TrainingType != null && createBadgeDto.TrainingType.IndexOfAny("*&#<>/".ToCharArray()) != -1)
        {
            return BadRequest("Įvesti negalimi simboliai.");
        }

        if (createBadgeDto.TrainingXp != null && createBadgeDto.TrainingXp < 0)
        {
            return BadRequest("Įvesti neigiamas skaičius treniruotės rezultatui.");
        }
        
        if (createBadgeDto.QuizXp != null && createBadgeDto.TrainingXp < 0)
        {
            return BadRequest("Įvesti neigiamas skaičius klausimų rezultatui.");
        }
        
        if (createBadgeDto.WPM != null && createBadgeDto.TrainingXp < 0)
        {
            return BadRequest("Įvesti neigiamas skaičius žodžiams per minutę.");
        }
        
        var badge = new Badge
        {
            Name = createBadgeDto.Name,
            Descripotion = createBadgeDto.Description,
        };

        if (badge.Name.Length == 0)
        {
            return BadRequest();
        }

        BadgeType badgeType;

        if (Enum.TryParse(createBadgeDto.Type, out badgeType))
        {
            badge.Type = badgeType;
        }

        switch (badge.Type)
        {
            case BadgeType.Quiz:
                badge.QuizXp = createBadgeDto.QuizXp;
                break;
            case BadgeType.Quote: 
                badge.WPM = createBadgeDto.WPM;
                break;
            case BadgeType.Training:
                badge.TrainingXp = createBadgeDto.TrainingXp;
                badge.TrainingType = createBadgeDto.TrainingType;
                break;
            default:
                return BadRequest("No badge type is provided or valid");
        }
        
        badge.BadgeImage = createBadgeDto.Image;

        await _badgesRepository.CreateAsync(badge);

        //201
        return Created("", new BadgeDto(badge.Id, badge.Name, badge.Descripotion));
    }

 
    [HttpPut]
    [Route("{badgeId}")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<BadgeDto>> Update(int badgeId, UpdateBadgeDto updateBadgeDto)
    {
        var badge = await _badgesRepository.GetAsync(badgeId);

        if (badge == null)
        {
            return NotFound();
        }

        if(updateBadgeDto.Name.Length == 0 || updateBadgeDto.Description.Length == 0)
        {
            return BadRequest();
        }
        
        if (updateBadgeDto.Name.IndexOfAny("*&#<>/".ToCharArray()) != -1)
        {
            return BadRequest("Įvesti negalimi simboliai.");
        }
        
        if (updateBadgeDto.Description.IndexOfAny("*&#<>/".ToCharArray()) != -1)
        {
            return BadRequest("Įvesti negalimi simboliai.");
        }

        badge.Name = updateBadgeDto.Name;
        badge.Descripotion = updateBadgeDto.Description;
        badge.BadgeImage = updateBadgeDto.BadgeImage; 

        await _badgesRepository.UpdateAsync(badge);

        return Ok(new BadgeDto(badge.Id, badge.Name, badge.Descripotion));
    }


    [HttpDelete("{badgeId}", Name = "DeleteBadge")]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult> Remove(int badgeId)
    {
        var badge = await _badgesRepository.GetAsync(badgeId);

        if (badge == null)
        {
            return NotFound();
        }

        await _badgesRepository.RemoveAsync(badge);
        
        //204
        return NoContent();
    }
}