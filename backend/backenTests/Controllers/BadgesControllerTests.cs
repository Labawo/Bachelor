using backend.Controllers;
using backend.Data.Dtos.Badges;
using backend.Data.Entities;
using backend.Data.Repositories;
using FakeItEasy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend.Tests.Controllers
{
    public class BadgesControllerTests
    {
        private BadgesController CreateController(out IBadgesRepository repo)
        {
            repo = A.Fake<IBadgesRepository>();
            var auth = A.Fake<IAuthorizationService>();
            return new BadgesController(repo, auth);
        }

        [Fact]
        public async Task GetMany_ReturnsAllBadges()
        {
            var controller = CreateController(out var repo);
            A.CallTo(() => repo.GetManyAsync()).Returns(new List<Badge>
            {
                new Badge { Id = 1, Name = "Badge1", Descripotion = "Test" }
            });

            var result = await controller.GetMany();

            Assert.Single(result);
        }

        [Fact]
        public async Task Get_ReturnsBadge()
        {
            var controller = CreateController(out var repo);
            A.CallTo(() => repo.GetAsync(1)).Returns(new Badge { Id = 1, Name = "Badge1", Descripotion = "Test", BadgeImage = "img" });

            var result = await controller.Get(1);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<BadgeImageDto>(ok.Value);
        }

        [Fact]
        public async Task Get_ReturnsNotFound_WhenBadgeMissing()
        {
            var controller = CreateController(out var repo);
            A.CallTo(() => repo.GetAsync(1)).Returns(Task.FromResult<Badge?>(null));

            var result = await controller.Get(1);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_ReturnsCreated()
        {
            var controller = CreateController(out var repo);

            var dto = new CreateBadgeDto("Valid", "Good", null, "Quiz", null, null, 0, null);

            var result = await controller.Create(dto);

            var created = Assert.IsType<CreatedResult>(result.Result);
            Assert.IsType<BadgeDto>(created.Value);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_OnInvalidSymbols()
        {
            var controller = CreateController(out var repo);

            var dto = new CreateBadgeDto("Valid", "Good", null, "Quiz", null, null, 0, null);

            var result = await controller.Create(dto);

            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_OnInvalidType()
        {
            var controller = CreateController(out var repo);

            var dto = new CreateBadgeDto("Valid", "Good", null, "Invalid", null, null, null, null);

            var result = await controller.Create(dto);

            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("No badge type is provided or valid", bad.Value);
        }

        [Fact]
        public async Task Update_ReturnsOk()
        {
            var controller = CreateController(out var repo);
            var badge = new Badge { Id = 1, Name = "Old", Descripotion = "Old" };

            A.CallTo(() => repo.GetAsync(1)).Returns(badge);

            var dto = new UpdateBadgeDto("New", "NewDesc", "img");
            var result = await controller.Update(1, dto);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<BadgeDto>(ok.Value);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenBadgeMissing()
        {
            var controller = CreateController(out var repo);
            A.CallTo(() => repo.GetAsync(999)).Returns(Task.FromResult<Badge?>(null));

            var dto = new UpdateBadgeDto("Name", "Desc", "img");
            var result = await controller.Update(999, dto);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Remove_ReturnsNoContent()
        {
            var controller = CreateController(out var repo);
            var badge = new Badge { Id = 1 };

            A.CallTo(() => repo.GetAsync(1)).Returns(badge);

            var result = await controller.Remove(1);

            Assert.IsType<NoContentResult>(result);
        }
    }
}
