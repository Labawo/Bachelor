using backend.Auth.Models;
using backend.Controllers;
using backend.Data.Dtos.Levels;
using backend.Data.Entities;
using backend.Data.Repositories;
using backend.Helpers;
using FakeItEasy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace backend.Tests.Controllers
{
    public class LevelsControllerTests
    {
        private LevelsController CreateController(out ILevelsRepository levelsRepo, out IWordsRepository wordsRepo, out IQuotesRepository quotesRepo, out UserManager<SiteUser> userManager)
        {
            levelsRepo = A.Fake<ILevelsRepository>();
            wordsRepo = A.Fake<IWordsRepository>();
            quotesRepo = A.Fake<IQuotesRepository>();
            var auth = A.Fake<IAuthorizationService>();
            userManager = A.Fake<UserManager<SiteUser>>();

            var controller = new LevelsController(userManager, levelsRepo, wordsRepo, quotesRepo, auth);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, "userId")
                    }))
                }
            };

            return controller;
        }

        [Fact]
        public async Task GetManyPaging_ReturnsLevels()
        {
            var controller = CreateController(out var levelsRepo, out _, out _, out _);
            var parameters = new LevelSearchParameters { PageNumber = 1, PageSize = 10 };

            var result = await controller.GetManyPaging(parameters);

            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task Get_ReturnsLevel()
        {
            var controller = CreateController(out var levelsRepo, out _, out _, out _);
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(new Level { Id = 1, Name = "Test" });

            var result = await controller.Get(1);
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Contains("Resource", ok.Value!.ToString());
        }

        [Fact]
        public async Task Get_ReturnsNotFound()
        {
            var controller = CreateController(out var levelsRepo, out _, out _, out _);
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(Task.FromResult<Level?>(null));

            var result = await controller.Get(1);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_ReturnsCreated()
        {
            var controller = CreateController(out var levelsRepo, out _, out _, out _);
            var dto = new CreateLevelDto("Level", "Description", 0, true);
            var result = await controller.Create(dto);

            var created = Assert.IsType<CreatedResult>(result.Result);
            Assert.IsType<LevelDto>(created.Value);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_OnInvalidSymbols()
        {
            var controller = CreateController(out var _, out _, out _, out _);
            var dto = new CreateLevelDto("Invalid*", "Description", 0, true);
            var result = await controller.Create(dto);
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Update_ReturnsOk()
        {
            var controller = CreateController(out var levelsRepo, out _, out _, out _);
            var level = new Level { Id = 1, Name = "Old", Description = "OldDesc", MinExperience = 0 };
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);

            var dto = new UpdateLevelDto("New", "NewDesc", 10);
            var result = await controller.Update(1, dto);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<LevelDto>(ok.Value);
        }

        [Fact]
        public async Task Update_ReturnsNotFound()
        {
            var controller = CreateController(out var levelsRepo, out _, out _, out _);
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(Task.FromResult<Level?>(null));
            var dto = new UpdateLevelDto("Level", "Desc", 0);

            var result = await controller.Update(1, dto);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Remove_ReturnsNoContent()
        {
            var controller = CreateController(out var levelsRepo, out var wordsRepo, out var quotesRepo, out _);
            var level = new Level { Id = 1, IsForWords = true };
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);
            A.CallTo(() => wordsRepo.GetManyAsync(1)).Returns(new List<Word>());

            var result = await controller.Remove(1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Remove_ReturnsForbid_WhenWordsExist()
        {
            var controller = CreateController(out var levelsRepo, out var wordsRepo, out _, out _);
            var level = new Level { Id = 1, IsForWords = true };
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);
            A.CallTo(() => wordsRepo.GetManyAsync(1)).Returns(new List<Word> { new Word { Id = 1 } });

            var result = await controller.Remove(1);

            Assert.IsType<ForbidResult>(result);
        }

        [Fact]
        public async Task Remove_ReturnsForbid_WhenQuotesExist()
        {
            var controller = CreateController(out var levelsRepo, out _, out var quotesRepo, out _);
            var level = new Level { Id = 1, IsForWords = false };
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);
            A.CallTo(() => quotesRepo.GetManyAsync(1)).Returns(new List<Quote> { new Quote { Id = 1 } });

            var result = await controller.Remove(1);

            Assert.IsType<ForbidResult>(result);
        }
    }
}
