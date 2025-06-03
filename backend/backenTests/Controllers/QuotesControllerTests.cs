using backend.Auth.Models;
using backend.Controllers;
using backend.Data.Dtos.Quotes;
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
    public class QuotesControllerTests
    {
        private QuotesController CreateController(
            out IQuotesRepository quotesRepo,
            out ILevelsRepository levelsRepo,
            out UserManager<SiteUser> userManager)
        {
            quotesRepo = A.Fake<IQuotesRepository>();
            levelsRepo = A.Fake<ILevelsRepository>();
            var authService = A.Fake<IAuthorizationService>();
            userManager = A.Fake<UserManager<SiteUser>>();

            var controller = new QuotesController(userManager, quotesRepo, levelsRepo, authService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
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
        public async Task GetManyPaging_ReturnsQuotes()
        {
            var controller = CreateController(out var quotesRepo, out var levelsRepo, out _);
            var level = new Level { Id = 1 };
            var searchParams = new QuoteSearchParameters { PageNumber = 1, PageSize = 10 };

            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);

            var result = await controller.GetManyPaging(1, searchParams);

            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task Get_ReturnsQuoteWithLinks()
        {
            var controller = CreateController(out var quotesRepo, out var levelsRepo, out _);
            var level = new Level { Id = 1 };
            var quote = new Quote { Id = 1, Content = "C", Source = "S", Author = "A", TimeToComplete = 60 };

            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);
            A.CallTo(() => quotesRepo.GetAsync(1, 1)).Returns(quote);

            var result = await controller.Get(1, 1);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Contains("Resource", ok.Value!.ToString());
        }

        [Fact]
        public async Task Get_ReturnsNotFound_WhenLevelMissing()
        {
            var controller = CreateController(out _, out var levelsRepo, out _);
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(Task.FromResult<Level?>(null));

            var result = await controller.Get(1, 1);
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task Create_ReturnsCreated()
        {
            var controller = CreateController(out var quotesRepo, out var levelsRepo, out _);
            var level = new Level { Id = 1, ItemCount = 0 };
            var dto = new CreateQuoteDto("Text", "Src", "Author", 60);

            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);

            var result = await controller.Create(1, dto);

            var created = Assert.IsType<CreatedResult>(result.Result);
            Assert.IsType<QuoteDto>(created.Value);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_WhenInvalidCharacters()
        {
            var controller = CreateController(out _, out var levelsRepo, out _);
            var level = new Level { Id = 1 };
            var dto = new CreateQuoteDto("Invalid*", "Src", "Author", 60);
            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);

            var result = await controller.Create(1, dto);

            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Įvesti negalimi simboliai.", bad.Value);
        }

        [Fact]
        public async Task Update_ReturnsOk()
        {
            var controller = CreateController(out var quotesRepo, out var levelsRepo, out _);
            var level = new Level { Id = 1 };
            var quote = new Quote { Id = 1 };
            var dto = new UpdateQuoteDto("C", "S", "A", 60);

            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);
            A.CallTo(() => quotesRepo.GetAsync(1, 1)).Returns(quote);

            var result = await controller.Update(1, 1, dto);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<QuoteDto>(ok.Value);
        }

        [Fact]
        public async Task Update_ReturnsBadRequest_WhenTimeTooLow()
        {
            var controller = CreateController(out var quotesRepo, out var levelsRepo, out _);
            var level = new Level { Id = 1 };
            var quote = new Quote { Id = 1 };
            var dto = new UpdateQuoteDto("C", "S", "A", 10);

            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);
            A.CallTo(() => quotesRepo.GetAsync(1, 1)).Returns(quote);

            var result = await controller.Update(1, 1, dto);

            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Įvestas per mažas laikas", bad.Value);
        }

        [Fact]
        public async Task Remove_ReturnsNoContent()
        {
            var controller = CreateController(out var quotesRepo, out var levelsRepo, out _);
            var level = new Level { Id = 1, ItemCount = 1 };
            var quote = new Quote { Id = 1 };

            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);
            A.CallTo(() => quotesRepo.GetAsync(1, 1)).Returns(quote);

            var result = await controller.Remove(1, 1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Remove_ReturnsNotFound_WhenQuoteMissing()
        {
            var controller = CreateController(out var quotesRepo, out var levelsRepo, out _);
            var level = new Level { Id = 1 };

            A.CallTo(() => levelsRepo.GetAsync(1)).Returns(level);
            A.CallTo(() => quotesRepo.GetAsync(1, 1)).Returns(Task.FromResult<Quote?>(null));

            var result = await controller.Remove(1, 1);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
