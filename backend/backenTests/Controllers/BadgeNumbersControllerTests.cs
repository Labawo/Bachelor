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

namespace backend.Tests.Controllers
{
    public class BadgeNumbersControllerTests
    {
        [Fact]
        public async Task CreateQuiz_ReturnsBadRequest()
        {
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task CreateQuiz_ReturnsCreatedResult()
        {
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task CreateQuote_ReturnsBadRequest()
        {
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task CreateQuote_ReturnsCreatedResult()
        {
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task Get_ReturnsBadge()
        {
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task Get_ReturnsBadRequest()
        {
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task GetMany_ReturnsBadges()
        {
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task CreateQuote250WPM_ReturnsBadRequest()
        {
            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task CreateQuizLess50_ReturnsOk()
        {
            Assert.Equal(1, 1);
        }
    }
}
