using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Auth;
using backend.Auth.Models;
using backend.Data;
using backend.Data.Repositories;
using backend.Helpers;
using backend.SignalR;

var builder = WebApplication.CreateBuilder(args);
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddControllers();

builder.Services.AddIdentity<SiteUser, IdentityRole>()
    .AddEntityFrameworkStores<LS_DbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddSignalR();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters.ValidAudience = builder.Configuration["JWT:ValidAudience"];
        options.TokenValidationParameters.ValidIssuer = builder.Configuration["JWT:ValidIssuer"];
        options.TokenValidationParameters.IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]));
        options.TokenValidationParameters.ClockSkew = new TimeSpan(0, 0, 5);
    });
    
builder.Services.AddDbContext<LS_DbContext>();

builder.Services.AddTransient<ILevelsRepository, LevelsRepository>();
builder.Services.AddTransient<IQuotesRepository, QuotesRepository>();
builder.Services.AddTransient<IWordsRepository, WordsRepository>();
builder.Services.AddTransient<INotesRepository, NotesRepository>();
builder.Services.AddTransient<IBadgesRepository, BadgesRepository>();
builder.Services.AddTransient<IBadgeNumbersRepository, BadgeNumbersRepository>();
builder.Services.AddTransient<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<AuthDbSeeder>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(PolicyNames.ResourceOwner, policy => policy.Requirements.Add(new ResourceOwnerRequirement()));
});

builder.Services.AddSingleton<IAuthorizationHandler, ResourceOwnerAuthorizationHandler>();

var app = builder.Build();

app.UseRouting();

app.UseCors(options =>
{
    options.WithOrigins("http://localhost:3000") // Specify your frontend URL
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials(); // Enable credentials
});

app.MapControllers();
app.MapHub<NoteHub>("/notesHub");
app.UseAuthentication();
app.UseAuthorization();

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<LS_DbContext>();
dbContext.Database.Migrate();

var dbSeeder = app.Services.CreateScope().ServiceProvider.GetRequiredService<AuthDbSeeder>();
await dbSeeder.SeedAsync();

app.Run();