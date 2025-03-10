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

        var badgeDto = new BadgeDto(badge.Id, badge.Name, badge.Descripotion);
        
        return Ok(badgeDto);
    }

    [HttpPost]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<Badge>> Create(CreateBadgeDto createBadgeDto)
    {
        var badge = new Badge
        {
            Name = createBadgeDto.Name,
            Descripotion = createBadgeDto.Description,
        };

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