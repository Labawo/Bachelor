using backend.Auth.Models;
using backend.Auth;
using backend.Controllers;
using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using backend.Data.Dtos.BadgeNumbers;
using backend.Data.Dtos.Badges;
using backend.Data.Entities;
using backend.Data.Repositories;
using System.Security.Claims;

namespace backend.Tests.Controllers
{
    public class BadgeNumbersControllerTests
    {
        private static BadgeNumbersController CreateControllerWithContext(out UserManager<SiteUser> userManager, out IBadgesRepository badgeRepo, out IBadgeNumbersRepository badgeNumberRepo, SiteUser? user = null)
        {
            userManager = A.Fake<UserManager<SiteUser>>();
            badgeRepo = A.Fake<IBadgesRepository>();
            badgeNumberRepo = A.Fake<IBadgeNumbersRepository>();

            var controller = new BadgeNumbersController(userManager, badgeRepo, badgeNumberRepo);
            var claimsUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "userId")
            }));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsUser }
            };

            return controller;
        }

        [Fact]
        public async Task CreateQuiz_ReturnsBadRequest()
        {
            var controller = CreateControllerWithContext(out var userManager, out var _, out var _);
            SiteUser nullUser = null;
            A.CallTo(() => userManager.FindByIdAsync("userId1")).Returns(nullUser);

            var result = await controller.CreateQuiz(new CreateQuizResultDto(60));

            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task CreateQuiz_ReturnsCreatedResult()
        {
            var controller = CreateControllerWithContext(out var userManager, out var badgeRepo, out var badgeNumberRepo);
            var user = new SiteUser { Id = "userId", QuizXp = 0, QuizDone = 0, NewBadgeCnt = 0 };

            A.CallTo(() => userManager.FindByIdAsync("userId")).Returns(user);
            A.CallTo(() => badgeRepo.GetManyQuizAsync(0)).Returns(new List<Badge> { new Badge { Id = 1 } });
            A.CallTo(() => badgeNumberRepo.GetManyUserAsync("userId")).Returns(new List<BadgeNumber>());

            var result = await controller.CreateQuiz(new CreateQuizResultDto(60));

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(1, okResult.Value);
        }

        [Fact]
        public async Task CreateQuote_ReturnsBadRequest()
        {
            var controller = CreateControllerWithContext(out var _, out var _, out var _);
            var result = await controller.CreateQuote(new CreateQuoteResultDto(250, 10, false));
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task CreateQuote_ReturnsCreatedResult()
        {
            var controller = CreateControllerWithContext(out var userManager, out var badgeRepo, out var badgeNumberRepo);
            var user = new SiteUser { Id = "userId", NewBadgeCnt = 0, XP = 0, WPM = 0, WPM10 = 0 };

            A.CallTo(() => userManager.FindByIdAsync("userId")).Returns(user);
            A.CallTo(() => badgeRepo.GetManyQuotesAsync(10)).Returns(new List<Badge> { new Badge { Id = 1 } });
            A.CallTo(() => badgeNumberRepo.GetManyUserAsync("userId")).Returns(new List<BadgeNumber>());

            var result = await controller.CreateQuote(new CreateQuoteResultDto(150, 10, false));

            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task Get_ReturnsBadge()
        {
            var controller = CreateControllerWithContext(out var userManager, out var badgeRepo, out var badgeNumberRepo);
            var user = new SiteUser { Id = "userId" };

            A.CallTo(() => userManager.FindByIdAsync("userId")).Returns(user);
            A.CallTo(() => badgeRepo.GetAsync(1)).Returns(new Badge { Id = 1, Name = "Test", Descripotion = "Desc", BadgeImage = "img" });
            A.CallTo(() => badgeNumberRepo.GetAsync(1)).Returns(new BadgeNumber { BadgeId = 1, OwnerId = "userId", EarnedBadges = 0 });

            var result = await controller.Get(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<BadgeImageDto>(okResult.Value);
        }

        [Fact]
        public async Task Get_ReturnsBadRequest()
        {
            var controller = CreateControllerWithContext(out var userManager, out var badgeRepo, out var _);
            int badgeNumber = 1;
            A.CallTo(() => badgeRepo.GetAsync(badgeNumber)).Returns(Task.FromResult<Badge?>(null));

            var result = await controller.Get(badgeNumber);
            var badResult = Assert.IsType<BadRequestResult>(result.Result);
        }

        [Fact]
        public async Task GetMany_ReturnsBadges()
        {
            var controller = CreateControllerWithContext(out var userManager, out var badgeRepo, out var badgeNumberRepo);
            var user = new SiteUser { Id = "userId", NewBadgeCnt = 0 };
            List<Badge> badgesArr = new List<Badge> { new Badge { Id = 1, Name = "Badge", Descripotion = "Desc", Type = BadgeType.Quiz, BadgeImage = null, QuizXp = 10, TrainingType = null, TrainingXp = null, WPM = null } };
            List<BadgeNumber> badgeNumbers = new List<BadgeNumber> { new BadgeNumber { BadgeId = 1, OwnerId = "userId", EarnedBadges = 0 } };

            A.CallTo(() => userManager.FindByIdAsync(A<string>._)).Returns(user);
            A.CallTo(() => badgeRepo.GetManyAsync()).Returns(badgesArr);
            A.CallTo(() => badgeNumberRepo.GetManyUserAsync("userId")).Returns(badgeNumbers);

            var result = await controller.GetMany();

            var badges = Assert.IsAssignableFrom<IEnumerable<BadgeImageSeenDto>>(result);
        }

        [Fact]
        public async Task CreateQuote250WPM_ReturnsBadRequest()
        {
            var controller = CreateControllerWithContext(out var _, out var _, out var _);
            var result = await controller.CreateQuote(new CreateQuoteResultDto(250, 250, false));
            var badResult = Assert.IsType<BadRequestResult>(result.Result);
        }

        [Fact]
        public async Task CreateQuizLess50_ReturnsOk()
        {
            var controller = CreateControllerWithContext(out var userManager, out var _, out var _);
            var user = new SiteUser { Id = "userId" };
            A.CallTo(() => userManager.FindByIdAsync("userId")).Returns(user);

            var result = await controller.CreateQuiz(new CreateQuizResultDto(45));
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(0, okResult.Value);
        }
    }
}
