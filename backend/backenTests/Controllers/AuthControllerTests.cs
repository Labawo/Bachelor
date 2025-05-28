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
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Tests.Controllers
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task Register_WithValidModel_ReturnsCreatedAtAction()
        {
            // Arrange
            var userManager = A.Fake<UserManager<SiteUser>>();
            var jwtTokenService = A.Fake<IJwtTokenService>();
            var controller = new AuthController(userManager, jwtTokenService);
            var token = new Task<string>(() => "hey");
            SiteUser nullUser = null;

            // Mock UserManager behavior
            A.CallTo(() => userManager.FindByNameAsync(A<string>._)).Returns(nullUser); // Assuming user does not exist
            A.CallTo(() => userManager.CreateAsync(A<SiteUser>._, A<string>._)).Returns(IdentityResult.Success);

            // Create a fake ControllerContext
            var controllerContext = new ControllerContext
            {
                HttpContext = A.Fake<HttpContext>()
            };
            controller.ControllerContext = controllerContext;

            // Act
            var registerUserDto = new RegisterUserDto("testuser", "testuser@example.com", "Password123!");
            var result = await controller.Register(registerUserDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(AuthController.Register), createdAtActionResult.ActionName);
        }

        [Fact]
        public async Task Register_WithInvalidModel_ReturnsBadRequest()
        {
            // Arrange
            var userManager = A.Fake<UserManager<SiteUser>>();
            var jwtTokenService = A.Fake<IJwtTokenService>();
            var controller = new AuthController(userManager, jwtTokenService);
            var token = new Task<string>(() => "hey");
            SiteUser user = new SiteUser();

            // Mock UserManager behavior
            A.CallTo(() => userManager.FindByNameAsync(A<string>._)).Returns(user); // Assuming user does not exist
            A.CallTo(() => userManager.CreateAsync(A<SiteUser>._, A<string>._)).Returns(IdentityResult.Success);

            // Create a fake ControllerContext
            var controllerContext = new ControllerContext
            {
                HttpContext = A.Fake<HttpContext>()
            };
            controller.ControllerContext = controllerContext;

            // Act
            var registerUserDto = new RegisterUserDto("testuser", "testuser@example.com", "password");
            var result = await controller.Register(registerUserDto);

            // Assert
            var badrequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badrequest.StatusCode);
        }

        [Fact]
        public async Task Login_WithValidCredentials_ReturnsOkWithAccessTokenAndRefreshToken()
        {
            // Arrange
            var userManager = A.Fake<UserManager<SiteUser>>();
            var jwtTokenService = A.Fake<IJwtTokenService>();
            var controller = new AuthController(userManager, jwtTokenService);
            var loginDto = new LoginDto("testuser", "Password123!");
            var user = new SiteUser { UserName = loginDto.UserName, EmailConfirmed = true };

            A.CallTo(() => userManager.FindByNameAsync(loginDto.UserName)).Returns(user);
            A.CallTo(() => userManager.CheckPasswordAsync(user, loginDto.Password)).Returns(true);
            A.CallTo(() => jwtTokenService.CreateAccessToken(loginDto.UserName, user.Id, A<IEnumerable<string>>._)).Returns("access_token");
            A.CallTo(() => jwtTokenService.CreateRefreshToken(user.Id)).Returns("refresh_token");

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            var successfulLoginDto = Assert.IsType<SuccessfulLoginDto>(okObjectResult.Value);
            Assert.Equal("access_token", successfulLoginDto.AccessToken);
            Assert.Equal("refresh_token", successfulLoginDto.RefreshToken);
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ReturnsBadRequest()
        {
            // Arrange
            var userManager = A.Fake<UserManager<SiteUser>>();
            var jwtTokenService = A.Fake<IJwtTokenService>();
            var controller = new AuthController(userManager, jwtTokenService);
            var loginDto = new LoginDto("testuser", "Password123!");
            var user = new SiteUser { UserName = loginDto.UserName, EmailConfirmed = true };

            A.CallTo(() => userManager.FindByNameAsync(loginDto.UserName)).Returns(user);
            A.CallTo(() => userManager.CheckPasswordAsync(user, loginDto.Password)).Returns(false);

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            var badrequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badrequest.StatusCode);
        }

        [Fact]
        public async Task UpdateToken_ValidRefreshToken_ReturnsOk()
        {
            // Arrange
            var userManager = A.Fake<UserManager<SiteUser>>();
            var jwtTokenService = A.Fake<IJwtTokenService>();
            var controller = new AuthController(userManager, jwtTokenService);

            var refreshTokenDto = new RefreshAccessTokenDto("valid_refresh_token");

            ClaimsPrincipal principal = new ClaimsPrincipal();

            A.CallTo(() => jwtTokenService.TryParseRefreshToken(refreshTokenDto.RefreshToken, out principal)).Returns(true);

            var user = new SiteUser { Id = "1", UserName = "user1", ForceRelogin = false };
            A.CallTo(() => userManager.FindByIdAsync(user.Id)).Returns(Task.FromResult(user));
            A.CallTo(() => userManager.GetRolesAsync(user)).Returns(Task.FromResult<IList<string>>(new List<string>()));

            A.CallTo(() => jwtTokenService.CreateAccessToken(user.UserName, user.Id, A<IEnumerable<string>>._)).Returns("fake_access_token");
            A.CallTo(() => jwtTokenService.CreateRefreshToken(user.Id)).Returns("fake_refresh_token");

            // Act
            var result = await controller.UpdateToken(refreshTokenDto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);

            var response = okResult.Value as SuccessfulLoginDto;
            Assert.NotNull(response);
            Assert.NotNull(response.AccessToken);
            Assert.NotNull(response.RefreshToken);
        }

        [Fact]
        public async Task UpdateToken_InvalidRefreshToken_ReturnsBadRequest()
        {
            // Arrange
            var userManager = A.Fake<UserManager<SiteUser>>();
            var jwtTokenService = A.Fake<IJwtTokenService>();

            var controller = new AuthController(userManager, jwtTokenService);

            var refreshTokenDto = new RefreshAccessTokenDto("valid_refresh_token");

            ClaimsPrincipal principal = new ClaimsPrincipal();

            A.CallTo(() => jwtTokenService.TryParseRefreshToken(refreshTokenDto.RefreshToken, out principal)).Returns(false);

            // Act
            var result = await controller.UpdateToken(refreshTokenDto);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }
    }
}
