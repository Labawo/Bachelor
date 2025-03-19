using backend.Auth.Models;
using backend.Data.Dtos.BadgeNumbers;
using backend.Data.Entities;
using backend.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Data.Dtos.Badges;

namespace backend.Controllers;

[ApiController]
[Route("api/badgesnumber")]
public class BadgeNumbersController : ControllerBase
{
    private readonly UserManager<SiteUser> _userManager;
    private readonly IBadgesRepository _badgesRepository;
    private readonly IBadgeNumbersRepository _badgeNumbersRepository;

    public BadgeNumbersController(UserManager<SiteUser> userManager, IBadgesRepository badgesRepository, IBadgeNumbersRepository badgeNumbersRepository)
    {
        _userManager = userManager;
        _badgesRepository = badgesRepository;
        _badgeNumbersRepository = badgeNumbersRepository;
    }

    [HttpPost]
    [Route("training")]
    public async Task<ActionResult<Badge>> CreateTraining(CreateTrainingDto requestDto)
    {
        var user = await _userManager.FindByIdAsync(requestDto.OwnerId);

        if(user == null)
        {
            return BadRequest();
        }

        var badges = await _badgesRepository.GetManyTrainingAsync(requestDto.Points, requestDto.TrainingType);
        var badgenumbers = await _badgeNumbersRepository.GetManyUserAsync(requestDto.OwnerId);
        var numbers = new List<BadgeNumber>();

        if(badges.Count() > 0)
        {
            if(badgenumbers.Count() == 0)
            {
                foreach(var badge in badges)
                {
                    BadgeNumber number = new BadgeNumber { OwnerId = requestDto.OwnerId, BadgeId = badge.Id, EarnedBadges =  0};

                    numbers.Add(number);
                }
            } else
            {
                foreach (var badge in badges)
                {
                    if(badgenumbers.Where(o => o.BadgeId == badge.Id) == null)
                    {
                        BadgeNumber number = new BadgeNumber { OwnerId = requestDto.OwnerId, BadgeId = badge.Id, EarnedBadges = 0 };

                        numbers.Add(number);
                    }                   
                }
            }
        }

        await _badgeNumbersRepository.CreateRangeAsync(numbers);

        user.NewBadgeCnt = user.NewBadgeCnt + numbers.Count();

        await _userManager.UpdateAsync(user);

        return Ok(numbers.Count());
    }

    [HttpPost]
    [Route("training")]
    public async Task<ActionResult<Badge>> CreateQuiz(CreateQuizDto requestDto)
    {
        var user = await _userManager.FindByIdAsync(requestDto.OwnerId);

        if (user == null)
        {
            return BadRequest();
        }

        var badges = await _badgesRepository.GetManyQuizAsync(requestDto.Points);
        var badgenumbers = await _badgeNumbersRepository.GetManyUserAsync(requestDto.OwnerId);
        var numbers = new List<BadgeNumber>();

        if (badges.Count() > 0)
        {
            if (badgenumbers.Count() == 0)
            {
                foreach (var badge in badges)
                {
                    BadgeNumber number = new BadgeNumber { OwnerId = requestDto.OwnerId, BadgeId = badge.Id, EarnedBadges = 0 };

                    numbers.Add(number);
                }
            }
            else
            {
                foreach (var badge in badges)
                {
                    if (badgenumbers.Where(o => o.BadgeId == badge.Id) == null)
                    {
                        BadgeNumber number = new BadgeNumber { OwnerId = requestDto.OwnerId, BadgeId = badge.Id, EarnedBadges = 0 };

                        numbers.Add(number);
                    }
                }
            }
        }

        await _badgeNumbersRepository.CreateRangeAsync(numbers);

        user.NewBadgeCnt = user.NewBadgeCnt + numbers.Count();

        await _userManager.UpdateAsync(user);

        return Ok(numbers.Count());
    }

    [HttpPost]
    [Route("quote")]
    public async Task<ActionResult<Badge>> CreateQuote(CreateQuoteDto requestDto)
    {
        var user = await _userManager.FindByIdAsync(requestDto.OwnerId);

        if (user == null)
        {
            return BadRequest();
        }

        var badges = await _badgesRepository.GetManyQuotesAsync(requestDto.Points);
        var badgenumbers = await _badgeNumbersRepository.GetManyUserAsync(requestDto.OwnerId);
        var numbers = new List<BadgeNumber>();

        if (badges.Count() > 0)
        {
            if (badgenumbers.Count() == 0)
            {
                foreach (var badge in badges)
                {
                    BadgeNumber number = new BadgeNumber { OwnerId = requestDto.OwnerId, BadgeId = badge.Id, EarnedBadges = 0 };

                    numbers.Add(number);
                }
            }
            else
            {
                foreach (var badge in badges)
                {
                    if (badgenumbers.Where(o => o.BadgeId == badge.Id) == null)
                    {
                        BadgeNumber number = new BadgeNumber { OwnerId = requestDto.OwnerId, BadgeId = badge.Id, EarnedBadges = 0 };

                        numbers.Add(number);
                    }
                }
            }
        }

        await _badgeNumbersRepository.CreateRangeAsync(numbers);

        user.NewBadgeCnt = user.NewBadgeCnt + numbers.Count();

        await _userManager.UpdateAsync(user);

        return Ok(numbers.Count());
    }

    [HttpGet]
    [Authorize]
    [Route("myBadges")]
    public async Task<IEnumerable<BadgeImageSeenDto>> GetMany()
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return new List<BadgeImageSeenDto>();
        }

        var badges = await _badgesRepository.GetManyAsync();
        var badgenumbers = await _badgeNumbersRepository.GetManyUserAsync(userId);
        var userBadges = new Dictionary<Badge, int>();

        if (badges.Count() > 0 && badgenumbers.Count() > 0)
        {
            foreach (var badge in badges)
            {
                var badgeNumber = badgenumbers.Where(o => o.BadgeId == badge.Id).FirstOrDefault();
                if (badgeNumber != null)
                {
                    userBadges.Add(badge, badgeNumber.EarnedBadges);
                }
            }
        }

        user.OldBadgeCnt = user.NewBadgeCnt; 

        await _userManager.UpdateAsync(user);

        return userBadges.Select(o => new BadgeImageSeenDto(o.Key.Id, o.Key.Name, o.Key.Descripotion, o.Key.BadgeImage, o.Value));
    }

    [HttpGet]
    [Authorize]
    [Route("myBadges/{badgeId}")]
    public async Task<ActionResult<BadgeDto>> Get(int badgeId)
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BadRequest();
        }

        var badge = await _badgesRepository.GetAsync(badgeId);

        if (badge == null)
        {
            return BadRequest();
        }

        var badgenumber = await _badgeNumbersRepository.GetAsync(badgeId);

        if(badgenumber == null)
        {
            return BadRequest();
        }

        await _badgeNumbersRepository.UpdateAsync(badgenumber);

        var badgeDto = new BadgeImageDto(badge.Id, badge.Name, badge.Descripotion, badge.BadgeImage);

        return Ok(badgeDto);
    }
}