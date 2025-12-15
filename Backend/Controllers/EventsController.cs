using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
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

        // GET: api/Events/trending
        [HttpGet("trending")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetTrendingEvents()
        {
            var trendingEvents = await _context.Events
                .Include(e => e.Organizer)
                    .ThenInclude(o => o.User)
                .Include(e => e.TicketTypes)
                .Select(e => new
                {
                    Event = e,
                    TicketsSold = e.TicketTypes.Sum(tt => tt.Quantity_Sold) // Sum of tickets sold across all ticket types
                })
                .OrderByDescending(x => x.TicketsSold)
                .Take(5)
                .ToListAsync();

            var eventDtos = trendingEvents.Select(item => new EventDto
            {
                Event_ID = item.Event.Event_ID,
                Category = item.Event.Category,
                Date = item.Event.Date,
                St_Date = item.Event.St_Date,
                E_Date = item.Event.E_Date,
                City = item.Event.City,
                Location = item.Event.Location,
                Capacity = item.Event.Capacity,
                Description = item.Event.Description,
                Image = item.Event.Image,
                OrganizerID = item.Event.OrganizerID,
                Organizer = new OrganizerDto
                {
                    UserID = item.Event.Organizer.UserID,
                    IsVerified = item.Event.Organizer.IsVerified,
                    User = new UserDto
                    {
                        ID = item.Event.Organizer.User.ID,
                        Name = item.Event.Organizer.User.Name,
                        First_Name = item.Event.Organizer.User.First_Name,
                        Last_Name = item.Event.Organizer.User.Last_Name,
                        Email = item.Event.Organizer.User.Email,
                        Phone_No = item.Event.Organizer.User.Phone_No,
                        DOB = item.Event.Organizer.User.DOB,
                        ProfilePic = item.Event.Organizer.User.ProfilePic
                    }
                },
                TicketTypes = item.Event.TicketTypes.Select(tt => new TicketTypeDto
                {
                    ID = tt.ID,
                    Name = tt.Name,
                    Price = tt.Price,
                    Quantity_Total = tt.Quantity_Total,
                    Quantity_Sold = tt.Quantity_Sold,
                    EventID = tt.Event_ID
                }).ToList()
            }).ToList();

            return Ok(eventDtos);
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
                    Description = e.Description,
                    Image = e.Image,
                    OrganizerID = e.OrganizerID,
                    Organizer = new OrganizerDto
                    {
                        UserID = e.Organizer.UserID,
                        IsVerified = e.Organizer.IsVerified,
                        User = new UserDto
                        {
                            ID = e.Organizer.User.ID,
                            Name = e.Organizer.User.Name,
                            First_Name = e.Organizer.User.First_Name,
                            Last_Name = e.Organizer.User.Last_Name,
                            Email = e.Organizer.User.Email,
                            Phone_No = e.Organizer.User.Phone_No,
                            DOB = e.Organizer.User.DOB,
                            ProfilePic = e.Organizer.User.ProfilePic
                        }
                    },
                    //=============================================
                    TicketTypes = e.TicketTypes.Select(tt => new TicketTypeDto
                    {
                        ID = tt.ID,
                        Name = tt.Name,
                        Price = tt.Price,
                        Quantity_Total = tt.Quantity_Total,
                        Quantity_Sold = tt.Quantity_Sold,
                        EventID = tt.Event_ID
                    }).ToList()
                })
                .ToListAsync();

            return Ok(events);
        }

        // GET: api/Events/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var eventItem = await _context.Events
                .Include(e => e.Organizer)
                .ThenInclude(o => o.User)
                .FirstOrDefaultAsync(e => e.Event_ID == id);

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
                Description = eventItem.Description,
                Image = eventItem.Image,
                OrganizerID = eventItem.OrganizerID,
                Organizer = new OrganizerDto
                {
                    UserID = eventItem.Organizer.UserID,
                    IsVerified = eventItem.Organizer.IsVerified,
                    User = new UserDto
                    {
                        ID = eventItem.Organizer.User.ID,
                        Name = eventItem.Organizer.User.Name,
                        First_Name = eventItem.Organizer.User.First_Name,
                        Last_Name = eventItem.Organizer.User.Last_Name,
                        Email = eventItem.Organizer.User.Email,
                        Phone_No = eventItem.Organizer.User.Phone_No,
                        DOB = eventItem.Organizer.User.DOB,
                        ProfilePic = eventItem.Organizer.User.ProfilePic
                    }
                }
            };

            return Ok(eventDto);
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<EventDto>>> FilterEvents(
    [FromQuery] string? city,
    [FromQuery] string? category)
        {
            var query = _context.Events
                .Include(e => e.Organizer)
                    .ThenInclude(o => o.User)
                .Include(e => e.TicketTypes)
                .AsQueryable();

            // Apply filters ONLY if values are provided
            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(e => e.City!.ToLower() == city.ToLower());

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(e => e.Category.ToLower() == category.ToLower());

            var events = await query.ToListAsync();

            if (events.Count == 0)
                return NotFound(new { message = "No events found matching filters." });

            // Map to DTO
            var eventDtos = events.Select(e => new EventDto
            {
                Event_ID = e.Event_ID,
                Category = e.Category,
                Date = e.Date,
                St_Date = e.St_Date,
                E_Date = e.E_Date,
                City = e.City,
                Location = e.Location,
                Capacity = e.Capacity,
                Description = e.Description,
                Image = e.Image,
                OrganizerID = e.OrganizerID,
                Organizer = new OrganizerDto
                {
                    UserID = e.Organizer.UserID,
                    IsVerified = e.Organizer.IsVerified,
                    User = new UserDto
                    {
                        ID = e.Organizer.User.ID,
                        Name = e.Organizer.User.Name,
                        First_Name = e.Organizer.User.First_Name,
                        Last_Name = e.Organizer.User.Last_Name,
                        Email = e.Organizer.User.Email,
                        Phone_No = e.Organizer.User.Phone_No,
                        DOB = e.Organizer.User.DOB,
                        ProfilePic = e.Organizer.User.ProfilePic
                    }
                },
                TicketTypes = e.TicketTypes.Select(t => new TicketTypeDto
                {
                    ID = t.ID,
                    Name = t.Name,
                    Price = t.Price,
                    Quantity_Total = t.Quantity_Total,
                    EventID = t.Event_ID
                }).ToList()
            });

            return Ok(eventDtos);
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
                Description = createEventDto.Description,
                Image = createEventDto.Image,
                OrganizerID = createEventDto.OrganizerID
            };

            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();

            // Create ticket types: use provided ones or defaults
            List<TicketType> ticketTypesToCreate;
            if (createEventDto.TicketTypes != null && createEventDto.TicketTypes.Any())
            {
                ticketTypesToCreate = createEventDto.TicketTypes.Select(tt => new TicketType
                {
                    Name = tt.Name,
                    Price = tt.Price,
                    Quantity_Total = tt.Quantity_Total,
                    Quantity_Sold = 0,
                    Event_ID = eventItem.Event_ID
                }).ToList();
            }
            else
            {
                // Default ticket types
                ticketTypesToCreate = new List<TicketType>
                {
                    new TicketType
                    {
                        Name = "VIP",
                        Price = 100.00m,
                        Quantity_Total = 50,
                        Quantity_Sold = 0,
                        Event_ID = eventItem.Event_ID
                    },
                    new TicketType
                    {
                        Name = "Regular",
                        Price = 50.00m,
                        Quantity_Total = 200,
                        Quantity_Sold = 0,
                        Event_ID = eventItem.Event_ID
                    }
                };
            }

            _context.TicketTypes.AddRange(ticketTypesToCreate);
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
                Description = eventItem.Description,
                Image = eventItem.Image,
                OrganizerID = eventItem.OrganizerID,
                TicketTypes = ticketTypesToCreate.Select(tt => new TicketTypeDto
                {
                    ID = tt.ID,
                    Name = tt.Name,
                    Price = tt.Price,
                    Quantity_Total = tt.Quantity_Total,
                    Quantity_Sold = tt.Quantity_Sold,
                    EventID = tt.Event_ID
                }).ToList()
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
            if (!string.IsNullOrEmpty(updateEventDto.Description))
                eventItem.Description = updateEventDto.Description;
            if (!string.IsNullOrEmpty(updateEventDto.Image))
                eventItem.Image = updateEventDto.Image;

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