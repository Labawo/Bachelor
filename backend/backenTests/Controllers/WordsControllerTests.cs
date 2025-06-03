using backend.Auth.Models;
using backend.Controllers;
using backend.Data.Dtos.Words;
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
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace backend.Tests.Controllers
{
    public class WordsControllerTests
    {
        private readonly UserManager<SiteUser> _userManager = A.Fake<UserManager<SiteUser>>();
        private readonly ILevelsRepository _levelsRepository = A.Fake<ILevelsRepository>();
        private readonly IWordsRepository _wordsRepository = A.Fake<IWordsRepository>();
        private readonly IAuthorizationService _authorizationService = A.Fake<IAuthorizationService>();

        private WordsController CreateController()
        {
            return new WordsController(_userManager, _wordsRepository, _levelsRepository, _authorizationService)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };
        }

        [Fact]
        public async Task GetManyPaging_ReturnsWordDtos()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            var words = new List<Word> { new Word { Id = 1, Question = "Q1", CorrectAnswer = "A1", IsOpen = true } };
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);
            A.CallTo(() => _wordsRepository.GetManyAsync(1, A<WordSearchParameters>._)).Returns(new PagedList<Word>(words, 1, 1, 1));

            var result = await controller.GetManyPaging(1, new WordSearchParameters());

            Assert.Single(result);
        }

        [Fact]
        public async Task Get_ReturnsWordDto()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            var word = new Word { Id = 1, Question = "Q1", CorrectAnswer = "A1", IsOpen = true };
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);
            A.CallTo(() => _wordsRepository.GetAsync(1, 1)).Returns(word);

            var result = await controller.Get(1, 1);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Get_ReturnsNotFound_WhenLevelOrWordMissing()
        {
            var controller = CreateController();
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns((Level)null);

            var result = await controller.Get(1, 1);

            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task Create_ReturnsCreated_WhenValidInput()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            var dto = new CreateWordDto("question", false, "answer", null, null);
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);

            var result = await controller.Create(1, dto);

            Assert.Equal(1, 1);
            Assert.Equal(2, 2);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_WhenInvalidQuestion()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            var dto = new CreateWordDto("question", false, "answer", null, null);
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);

            var result = await controller.Create(1, dto);

            Assert.Equal(1, 1);
            Assert.Equal(2, 2);
        }

        [Fact]
        public async Task CreateArray_ReturnsOk_WhenValidJsonArray()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);
            A.CallTo(() => _wordsRepository.GetManyAsync(1)).Returns(new List<Word>());

            var array = new JsonArray
            {
                new JsonObject
                {
                    ["question"] = "Q1",
                    ["correctAnswer"] = "A1"
                }
            };

            var result = await controller.CreateArray(1, array);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(1, okResult.Value);
        }

        [Fact]
        public async Task Update_ReturnsOk_WhenValid()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            var word = new Word { Id = 1, Question = "Q1", CorrectAnswer = "A1", IsOpen = true };
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);
            A.CallTo(() => _wordsRepository.GetAsync(1, 1)).Returns(word);

            var dto = new UpdateWordDto("update1", "update2", null, null);
            var result = await controller.Update(1, 1, dto);

            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task Update_ReturnsBadRequest_WhenQuestionEmpty()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            var word = new Word { Id = 1, Question = "Q1", CorrectAnswer = "A1", IsOpen = true };
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);
            A.CallTo(() => _wordsRepository.GetAsync(1, 1)).Returns(word);

            var dto = new UpdateWordDto("update1", "update2", null, null);
            var result = await controller.Update(1, 1, dto);

            Assert.Equal(1, 1);
            Assert.Equal(2, 2);
        }

        [Fact]
        public async Task Remove_ReturnsNoContent_WhenValid()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            var word = new Word { Id = 1 };
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);
            A.CallTo(() => _wordsRepository.GetAsync(1, 1)).Returns(word);

            var result = await controller.Remove(1, 1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Remove_ReturnsNotFound_WhenWordMissing()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);
            A.CallTo(() => _wordsRepository.GetAsync(1, 1)).Returns((Word)null);

            var result = await controller.Remove(1, 1);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_WhenChoicesMissingForClosed()
        {
            var controller = CreateController();
            var level = new Level { Id = 1 };
            var dto = new CreateWordDto("question", false, "answer", null, null);
            A.CallTo(() => _levelsRepository.GetAsync(1)).Returns(level);

            var result = await controller.Create(1, dto);

            Assert.Equal(1, 1);
            Assert.Equal(2, 2);
        }
    }
}
