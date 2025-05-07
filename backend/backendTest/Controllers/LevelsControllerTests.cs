using backend.Auth.Models;
using backend.Controllers;
using backend.Data.Dtos.Levels;
using backend.Data.Repositories;
using backend.Data.Entities;
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

namespace backendTest.Controllers
{
    public class LevelsControllerTests
    {
        [Fact]
        public async Task GetManyPaging_ReturnsLevels()
        {
            // Arrange
            var levelsRepository = A.Fake<ILevelsRepository>();
            var wordRepository = A.Fake<IWordsRepository>();
            var quotesRepository = A.Fake<IQuotesRepository>();
            var authorizationService = A.Fake<IAuthorizationService>();
            var userManager = A.Fake<UserManager<SiteUser>>();

            var controller = new LevelsController(userManager, levelsRepository, wordRepository, quotesRepository, authorizationService);
            var searchParameters = new LevelSearchParameters
            {
                PageNumber = 1,
                PageSize = 2 // Or any other appropriate value
            };

            var levels = new List<Level>
            {
                new Level { Id = 1, Name = "Level 1", Description = "Description 1", MinExperience = 0, IsForWords = true },
                new Level { Id = 2, Name = "Level 2", Description = "Description 2", MinExperience = 0, IsForWords = true }
            };

            A.CallTo(() => levelsRepository.GetManyAsync(searchParameters)).Returns(Task.FromResult(new PagedList<Level>(levels, 2, 1, 2)));

            var httpContext = new DefaultHttpContext();
            httpContext.Response.Headers.Add("Pagination", "value");
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.GetManyPaging(searchParameters);

            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task Get_ReturnsTherapy()
        {
            // Arrange
            var levelsRepository = A.Fake<ILevelsRepository>();
            var wordRepository = A.Fake<IWordsRepository>();
            var quotesRepository = A.Fake<IQuotesRepository>();
            var authorizationService = A.Fake<IAuthorizationService>();
            var userManager = A.Fake<UserManager<SiteUser>>();

            var controller = new LevelsController(userManager, levelsRepository, wordRepository, quotesRepository, authorizationService);
            var levelId = 1;

            var level = new Level() { Id = levelId, Name = "Level 1", Description = "Description 1", MinExperience = 0, IsForWords = true };

            A.CallTo(() => levelsRepository.GetAsync(levelId)).Returns(Task.FromResult(level));

            // Act
            var result = await controller.Get(levelId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result.Result);
            var value = ((OkObjectResult)result.Result).Value;
            Assert.NotNull(value);

            var properties = value.GetType().GetProperties();

            // Access Resource and Links properties using reflection
            var resourceProperty = properties.FirstOrDefault(p => p.Name == "Resource");
            var linksProperty = properties.FirstOrDefault(p => p.Name == "Links");

            // Assert that Resource and Links properties are not null
            Assert.NotNull(resourceProperty);
            Assert.NotNull(linksProperty);

            // Get values of Resource and Links properties
            var resource = resourceProperty.GetValue(value);
            var links = linksProperty.GetValue(value);

            // Assert that Resource and Links values are not null
            Assert.NotNull(resource);
            Assert.NotNull(links);
            Assert.IsType<LevelWithDescriptionDto>(resource);
            Assert.Contains("Name = Level 1", resource.ToString());
        }

        [Fact]
        public async Task Create_ReturnsCreatedResult()
        {
            // Arrange
            var levelsRepository = A.Fake<ILevelsRepository>();
            var wordRepository = A.Fake<IWordsRepository>();
            var quotesRepository = A.Fake<IQuotesRepository>();
            var authorizationService = A.Fake<IAuthorizationService>();
            var userManager = A.Fake<UserManager<SiteUser>>();

            var controller = new LevelsController(userManager, levelsRepository, wordRepository, quotesRepository, authorizationService);
            var createLevelDto = new CreateLevelDto
            (
                "New Level",
                "Description of new level",
                0,
                true
            );

            // Mock User property
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "userId"), // Simulate user ID
                new Claim(ClaimTypes.Role, SiteRoles.Admin) // Simulate user role
            }));

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            // Act
            var result = await controller.Create(createLevelDto);

            // Assert
            var actionResult = Assert.IsType<ActionResult<LevelDto>>(result);
            Assert.NotNull(actionResult);
            Assert.IsType<CreatedResult>(actionResult.Result);
        }

        [Fact]
        public async Task Update_ReturnsUpdatedResult()
        {
            // Arrange
            var levelsRepository = A.Fake<ILevelsRepository>();
            var wordRepository = A.Fake<IWordsRepository>();
            var quotesRepository = A.Fake<IQuotesRepository>();
            var authorizationService = A.Fake<IAuthorizationService>();
            var userManager = A.Fake<UserManager<SiteUser>>();

            var controller = new LevelsController(userManager, levelsRepository, wordRepository, quotesRepository, authorizationService);

            var authorizationResult = AuthorizationResult.Success(); // Simulate successful authorization
            A.CallTo(() => authorizationService.AuthorizeAsync(A<ClaimsPrincipal>._, A<object>._, A<string>._))
                .Returns(authorizationResult);

            var updateLevelDto = new UpdateLevelDto
            (
                "Updated Level",
                "Updated description of level",
                10
            );
            var levelId = 1;

            // Mock User property
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "userId"), // Simulate user ID
                new Claim(ClaimTypes.Role, SiteRoles.Admin) // Simulate user role
            }));

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var existingLevel = new Level
            {
                Id = levelId,
                Name = "Existing Level",
                Description = "Existing description of level",
                MinExperience = 0,
                IsForWords = true
            };

            A.CallTo(() => levelsRepository.GetAsync(levelId)).Returns(existingLevel);


            // Act
            var result = await controller.Update(levelId, updateLevelDto);

            // Assert
            var actionResult = Assert.IsType<ActionResult<LevelDto>>(result);
            Assert.NotNull(actionResult);
            Assert.IsType<OkObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task Remove_ReturnsNoContentResult()
        {
            // Arrange
            var levelsRepository = A.Fake<ILevelsRepository>();
            var wordRepository = A.Fake<IWordsRepository>();
            var quotesRepository = A.Fake<IQuotesRepository>();
            var authorizationService = A.Fake<IAuthorizationService>();
            var userManager = A.Fake<UserManager<SiteUser>>();

            var controller = new LevelsController(userManager, levelsRepository, wordRepository, quotesRepository, authorizationService);

            var authorizationResult = AuthorizationResult.Success(); // Simulate successful authorization
            A.CallTo(() => authorizationService.AuthorizeAsync(A<ClaimsPrincipal>._, A<object>._, A<string>._))
                .Returns(authorizationResult);

            var levelId = 1;

            // Mock User property
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "userId"), // Simulate user ID
                new Claim(ClaimTypes.Role, SiteRoles.Admin) // Simulate user role
            }));

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var existingLevel = new Level
            {
                Id = levelId,
                Name = "Existing Level",
                Description = "Existing description of level",
                MinExperience = 0,
                IsForWords = true
            };

            A.CallTo(() => levelsRepository.GetAsync(levelId)).Returns(existingLevel);
            A.CallTo(() => wordRepository.GetManyAsync(levelId)).Returns(new List<Word>()); // Assuming no appointments exist

            // Act
            var result = await controller.Remove(levelId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
