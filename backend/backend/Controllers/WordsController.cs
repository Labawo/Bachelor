using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using backend.Auth.Models;
using backend.Data.Dtos.Words;
using backend.Data.Repositories;
using backend.Data.Entities;

namespace backend.Controllers;

[ApiController]
[Route("api/therapies/{therapyId}/appointments")]
public class WordsController : ControllerBase
{
    private readonly UserManager<SiteUser> _userManager;
    private readonly ILevelsRepository _levelsRepository;
    private readonly IWordsRepository _wordsRepository;
    private readonly IAuthorizationService _authorizationService;

    public WordsController(UserManager<SiteUser> userManager, IWordsRepository wordsRepository,
        ILevelsRepository levelsRepository, IAuthorizationService authorizationService)
    {
        _userManager = userManager;
        _wordsRepository = wordsRepository;
        _levelsRepository = levelsRepository;
        _authorizationService = authorizationService;
    }

    [HttpGet(Name = "GetWords")]
    public async Task<IEnumerable<WordDto>> GetManyPaging(int levelId, [FromQuery] WordSearchParameters searchParameters)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return new List<WordDto>();

        var words = await _wordsRepository.GetManyAsync(level.Id, searchParameters);

        var previousPageLink = words.HasPrevious
            ? CreateLevelsResourceUri(searchParameters,
                RecourceUriType.PreviousPage)
            : null;
        
        var nextPageLink = words.HasNext
            ? CreateLevelsResourceUri(searchParameters,
                RecourceUriType.NextPage)
            : null;

        var paginationMetaData = new
        {
            totalCount = words.TotalCount,
            pageSize = words.PageSize,
            currentPage = words.CurrentPage,
            totalPages = words.TotalPages,
            previousPageLink,
            nextPageLink
        };

        if (paginationMetaData != null && !Response.Headers.ContainsKey("Pagination"))
        {
            // Add pagination metadata to response header
            Response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationMetaData));
        }

        return words.Select(o => new WordDto(o.Id, o.Name, o.DoctorName, o.OwnerId));
    }
    
    [HttpGet("{wordId}", Name = "GetWord")]
    public async Task<ActionResult<WordDto>> Get(int levelId, int wordId)
    {
        var level = await _levelsRepository.GetAsync(levelId);
        if (level == null) return NotFound($"Couldn't find a level with id of {levelId}");

        var word = await _wordsRepository.GetAsync(level.Id, wordId);
        if (word == null) return NotFound();

        var links = CreateLinksForWords(wordId);

        var wordDto = new WordDto(level.Id, level.Name);
        
        return Ok(new { Resource = wordDto, Links = links});
    }

    [HttpPost]
    [Authorize(Roles = SiteRoles.Admin)]
    public async Task<ActionResult<WordDto>> Create(int levelId, CreateWordDto wordDto)
    {
        var therapy = await _therapiesRepository.GetAsync(therapyId);
        if (therapy == null) return NotFound($"Couldn't find a therapy with id of {therapyId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, therapy, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var appointment = new Appointment { Price = appointmentDto.Price };
        appointment.therapy = therapy;
        appointment.TherapyId = therapy.Id;
        var userId = therapy.OwnerId;
        var doctor = await _userManager.FindByIdAsync(userId);

        if (doctor != null)
        {
            appointment.DoctorName =
                doctor.UserName; // Replace FullName with the property name containing the doctor's name in your ApplicationUser model
        }

        var existingAppointments = await _appointmentRepository.GetManyForDoctorWithoutFilterAsync(therapy.OwnerId);
        DateTime oneWeekFromNow = DateTime.UtcNow.AddDays(7);

        var weeklyAppointments = existingAppointments.Where(existingAppointment =>
            existingAppointment.Time >= DateTime.UtcNow && existingAppointment.Time <= oneWeekFromNow
        );

        // Convert the appointment time from the DTO to DateTime
        DateTime newAppointmentStart = DateTime.Parse(appointmentDto.Time);
        DateTime newAppointmentEnd = newAppointmentStart.AddHours(1);

        // Check if there's any existing appointment that overlaps with the new appointment
        if (existingAppointments.Any(existingAppointment =>
                (existingAppointment.Time >= newAppointmentStart && existingAppointment.Time < newAppointmentEnd) ||
                (existingAppointment.Time <= newAppointmentStart &&
                 existingAppointment.Time.AddHours(1) > newAppointmentStart)
            ) || weeklyAppointments.Count() >= 12)
        {
            return Conflict("Appointment at this time already exists or you have reached appointment limit.");
        }


        appointment.Time = DateTime.Parse(appointmentDto.Time);

        if (appointment.Time < DateTime.UtcNow)
        {
            return Forbid();
        }

        await _appointmentRepository.CreateAsync(appointment);

        return Created("GetAppointment",
            new AppointmentDto(appointment.Id, appointment.Time, appointment.Price, appointment.PatientId,
                appointment.DoctorName));
    }

    [HttpPut("{appointmentId}")]
    [Authorize(Roles = ClinicRoles.Doctor + "," + ClinicRoles.Admin)]
    public async Task<ActionResult<AppointmentDto>> Update(int therapyId, int appointmentId,
        UpdateAppointmentDto updateAppointmentDto)
    {
        var therapy = await _therapiesRepository.GetAsync(therapyId);
        if (therapy == null) return NotFound($"Couldn't find a therapy with id of {therapyId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, therapy, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var oldAppointment = await _appointmentRepository.GetAsync(therapyId, appointmentId);
        if (oldAppointment == null)
            return NotFound();

        //oldPost.Body = postDto.Body;
        oldAppointment.Price = updateAppointmentDto.Price;

        if (oldAppointment.Time < DateTime.UtcNow)
        {
            return Forbid();
        }

        if (oldAppointment.Time != DateTime.Parse(updateAppointmentDto.Time))
        {
            var existingAppointments = await _appointmentRepository.GetManyForDoctorWithoutFilterAsync(therapy.OwnerId);
            DateTime oneWeekFromNow = DateTime.UtcNow.AddDays(7);

            var weeklyAppointments = existingAppointments.Where(appointment =>
                appointment.Time >= DateTime.UtcNow && appointment.Time <= oneWeekFromNow
            );

            // Convert the appointment time from the DTO to DateTime
            DateTime newAppointmentStart = DateTime.Parse(updateAppointmentDto.Time);
            DateTime newAppointmentEnd = newAppointmentStart.AddHours(1);

            // Check if there's any existing appointment that overlaps with the new appointment
            if (existingAppointments.Any(appointment =>
                    (appointment.Time >= newAppointmentStart && appointment.Time < newAppointmentEnd) ||
                    (appointment.Time <= newAppointmentStart && appointment.Time.AddHours(1) > newAppointmentStart)
                ) || weeklyAppointments.Count() >= 12)
            {
                return Conflict("Appointment at this time already exists or you have reached appointment limit.");
            }

            oldAppointment.Time = DateTime.Parse(updateAppointmentDto.Time);

            if (oldAppointment.Time < DateTime.UtcNow)
            {
                return Forbid();
            }
        }

        await _appointmentRepository.UpdateAsync(oldAppointment);

        if (oldAppointment.PatientId != null)
        {
            var notification = new Notification
            {
                Content = "Your selected appointment was changed.",
                Time = DateTime.UtcNow,
                OwnerId = oldAppointment.PatientId
            };

            await _notificationsRepository.CreateAsync(notification);
        }

        return Ok(new AppointmentDto(oldAppointment.Id, oldAppointment.Time, oldAppointment.Price,
            oldAppointment.PatientId, oldAppointment.DoctorName));
    }

    [HttpDelete("{appointmentId}")]
    [Authorize(Roles = ClinicRoles.Doctor + "," + ClinicRoles.Admin)]
    public async Task<ActionResult> Remove(int therapyId, int appointmentId)
    {
        var therapy = await _therapiesRepository.GetAsync(therapyId);
        if (therapy == null) return NotFound($"Couldn't find a therapy with id of {therapyId}");

        var authorizationResult = await _authorizationService.AuthorizeAsync(User, therapy, PolicyNames.ResourceOwner);

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var appointment = await _appointmentRepository.GetAsync(therapyId, appointmentId);
        if (appointment == null)
            return NotFound();

        if (appointment.PatientId != null)
        {
            var notification = new Notification
            {
                Content = "Appointment at " + appointment.Time + " was removed.",
                Time = DateTime.UtcNow,
                OwnerId = appointment.PatientId
            };

            await _notificationsRepository.CreateAsync(notification);
        }

        await _appointmentRepository.RemoveAsync(appointment);

        // 204
        return NoContent();
    }
}