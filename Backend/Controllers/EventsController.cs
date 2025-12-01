using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tessera.API.Data;
using Tessera.API.Models;
using Tessera.API.DTOs;

namespace Tessera.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents()
        {
            var events = await _context.Events
                .Select(e => new EventDto
                {
                    Event_ID = e.Event_ID,
                    Category = e.Category,
                    Date = e.Date,
                    St_Date = e.St_Date,
                    E_Date = e.E_Date,
                    City = e.City,
                    Location = e.Location,
                    Capacity = e.Capacity,
                    Countdown = e.Countdown,
                    OrganizerID = e.OrganizerID
                })
                .ToListAsync();

            return Ok(events);
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var eventItem = await _context.Events.FindAsync(id);

            if (eventItem == null)
            {
                return NotFound(new { message = "Event not found" });
            }

            var eventDto = new EventDto
            {
                Event_ID = eventItem.Event_ID,
                Category = eventItem.Category,
                Date = eventItem.Date,
                St_Date = eventItem.St_Date,
                E_Date = eventItem.E_Date,
                City = eventItem.City,
                Location = eventItem.Location,
                Capacity = eventItem.Capacity,
                Countdown = eventItem.Countdown,
                OrganizerID = eventItem.OrganizerID
            };

            return Ok(eventDto);
        }

        // POST: api/Events
        [HttpPost]
        public async Task<ActionResult<EventDto>> CreateEvent(CreateEventDto createEventDto)
        {
            // Validate that organizer exists
            if (!await _context.Organizers.AnyAsync(o => o.UserID == createEventDto.OrganizerID))
            {
                return BadRequest(new { message = "Organizer not found" });
            }

            var eventItem = new Event
            {
                Category = createEventDto.Category,
                Date = createEventDto.Date,
                St_Date = createEventDto.St_Date,
                E_Date = createEventDto.E_Date,
                City = createEventDto.City,
                Location = createEventDto.Location,
                Capacity = createEventDto.Capacity,
                OrganizerID = createEventDto.OrganizerID
            };

            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();

            var eventDto = new EventDto
            {
                Event_ID = eventItem.Event_ID,
                Category = eventItem.Category,
                Date = eventItem.Date,
                St_Date = eventItem.St_Date,
                E_Date = eventItem.E_Date,
                City = eventItem.City,
                Location = eventItem.Location,
                Capacity = eventItem.Capacity,
                Countdown = eventItem.Countdown,
                OrganizerID = eventItem.OrganizerID
            };

            return CreatedAtAction(nameof(GetEvent), new { id = eventItem.Event_ID }, eventDto);
        }

        // PUT: api/Events/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, UpdateEventDto updateEventDto)
        {
            var eventItem = await _context.Events.FindAsync(id);

            if (eventItem == null)
            {
                return NotFound(new { message = "Event not found" });
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(updateEventDto.Category))
                eventItem.Category = updateEventDto.Category;
            if (updateEventDto.Date.HasValue)
                eventItem.Date = updateEventDto.Date.Value;
            if (updateEventDto.St_Date.HasValue)
                eventItem.St_Date = updateEventDto.St_Date.Value;
            if (updateEventDto.E_Date.HasValue)
                eventItem.E_Date = updateEventDto.E_Date.Value;
            if (!string.IsNullOrEmpty(updateEventDto.City))
                eventItem.City = updateEventDto.City;
            if (!string.IsNullOrEmpty(updateEventDto.Location))
                eventItem.Location = updateEventDto.Location;
            if (updateEventDto.Capacity.HasValue)
                eventItem.Capacity = updateEventDto.Capacity.Value;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Events/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var eventItem = await _context.Events.FindAsync(id);

            if (eventItem == null)
            {
                return NotFound(new { message = "Event not found" });
            }

            _context.Events.Remove(eventItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}