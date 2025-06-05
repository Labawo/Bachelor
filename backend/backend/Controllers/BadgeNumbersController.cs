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
using Microsoft.IdentityModel.Tokens;

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
    public async Task<ActionResult<Badge>> CreateTraining(CreateTrainingResultDto requestDto)
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId);

        if(user == null)
        {
            return BadRequest();
        }

        var badges = await _badgesRepository.GetManyTrainingAsync(requestDto.Points, requestDto.TrainingType);
        var badgeNumbers = await _badgeNumbersRepository.GetManyUserAsync(userId);
        var numbers = new List<BadgeNumber>();

        if(badges.Count() > 0)
        {
            if(badgeNumbers.Count() == 0)
            {
                foreach(var badge in badges)
                {
                    BadgeNumber number = new BadgeNumber { OwnerId = userId, BadgeId = badge.Id, EarnedBadges =  0};

                    numbers.Add(number);
                }
            } 
            else
            {
                foreach (var badge in badges)
                {
                    if(badgeNumbers.Where(o => o.BadgeId == badge.Id).Count() == 0)
                    {
                        BadgeNumber number = new BadgeNumber { OwnerId = userId, BadgeId = badge.Id, EarnedBadges = 0 };

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
    [Route("quiz")]
    public async Task<ActionResult<Badge>> CreateQuiz(CreateQuizResultDto requestDto)
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BadRequest();
        }

        if (requestDto.Points >= 50)
        {
            var badges = await _badgesRepository.GetManyQuizAsync(user.QuizDone is null ? 0 : (int)user.QuizDone);
            var badgenumbers = await _badgeNumbersRepository.GetManyUserAsync(userId);
            var numbers = new List<BadgeNumber>();

            if (badges.Count() > 0)
            {
                if (badgenumbers.Count() == 0)
                {
                    foreach (var badge in badges)
                    {
                        BadgeNumber number = new BadgeNumber { OwnerId = userId, BadgeId = badge.Id, EarnedBadges = 0 };

                        numbers.Add(number);
                    }
                }
                else
                {
                    foreach (var badge in badges)
                    {
                        if (badgenumbers.Where(o => o.BadgeId == badge.Id).Count() == 0)
                        {
                            BadgeNumber number = new BadgeNumber { OwnerId = userId, BadgeId = badge.Id, EarnedBadges = 0 };

                            numbers.Add(number);
                        }
                    }
                }
            }

            await _badgeNumbersRepository.CreateRangeAsync(numbers);

            user.QuizXp += 10;
            user.QuizDone += 1;
        
            if (user.NewBadgeCnt == null)
            {
                user.NewBadgeCnt = numbers.Count();
            }
            else
            {
                user.NewBadgeCnt += numbers.Count();
            }

            await _userManager.UpdateAsync(user);

            return Ok(numbers.Count());
        }

        return Ok(0);
    }

    [HttpPost]
    [Route("quote")]
    public async Task<ActionResult<Badge>> CreateQuote(CreateQuoteResultDto requestDto)
    {
        if (requestDto.WPM > 200)
        {
            return BadRequest();
        }
        
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BadRequest();
        }

        var badges = await _badgesRepository.GetManyQuotesAsync(requestDto.Single ? 0 : requestDto.Points);
        var badgenumbers = await _badgeNumbersRepository.GetManyUserAsync(userId);
        var numbers = new List<BadgeNumber>();

        if (!badges.IsNullOrEmpty())
        {
            if (badgenumbers.IsNullOrEmpty())
            {
                foreach (var badge in badges)
                {
                    BadgeNumber number = new BadgeNumber { OwnerId = userId, BadgeId = badge.Id, EarnedBadges = 0 };

                    numbers.Add(number);
                }
            }
            else
            {
                foreach (var badge in badges)
                {
                    if (badgenumbers.Where(o => o.BadgeId == badge.Id).Count() == 0)
                    {
                        BadgeNumber number = new BadgeNumber { OwnerId = userId, BadgeId = badge.Id, EarnedBadges = 0 };

                        numbers.Add(number);
                    }
                }
            }
        }

        await _badgeNumbersRepository.CreateRangeAsync(numbers);

        if (user.NewBadgeCnt == null)
        {
            user.NewBadgeCnt = numbers.Count();
        }
        else
        {
            user.NewBadgeCnt += numbers.Count();
        }

        if (requestDto.Single)
        {
            user.XP += 1;
        }
        else
        {
            user.XP += 10;
            user.WPM += requestDto.WPM;
            user.WPM10 += 1;
        }

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

        badgenumber.EarnedBadges = 1;

        await _badgeNumbersRepository.UpdateAsync(badgenumber);

        var badgeDto = new BadgeImageDto(badge.Id, badge.Name, badge.Descripotion, badge.BadgeImage);

        return Ok(badgeDto);
    }
}