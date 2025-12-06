using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tessera.API.Data;
using Tessera.API.Models;
using Tessera.API.DTOs;
using Tessera.API.Controllers;

namespace Tessera.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.TicketType) // Include ticket type details
                .Select(t => new TicketDto
                {
                    Ticket_ID = t.Ticket_ID,
                    Status = t.Status,
                    QR_Code = t.QR_Code,
                    TicketTypeID = t.TicketTypeID,
                    EventID = t.EventID,
                    TicketType = new TicketTypeDto
                    {
                        ID = t.TicketType.ID,
                        Name = t.TicketType.Name,
                        Price = t.TicketType.Price,
                        Quantity_Total = t.TicketType.Quantity_Total,
                        Quantity_Sold = t.TicketType.Quantity_Sold
                    },
                    UserID = t.UserID
                })
                .ToListAsync();

            return Ok(tickets);
        }
        // GET: api/Tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.TicketType) // Include ticket type details
                .FirstOrDefaultAsync(t => t.Ticket_ID == id);

            if (ticket == null)
            {
                return NotFound(new { message = "Ticket not found" });
            }

            var ticketDto = new TicketDto
            {
                Ticket_ID = ticket.Ticket_ID,
                Status = ticket.Status,
                QR_Code = ticket.QR_Code,
                TicketTypeID = ticket.TicketTypeID,
                EventID = ticket.EventID,
                TicketType = new TicketTypeDto
                {
                    ID = ticket.TicketType.ID,
                    Name = ticket.TicketType.Name,
                    Price = ticket.TicketType.Price,
                    Quantity_Total = ticket.TicketType.Quantity_Total,
                    Quantity_Sold = ticket.TicketType.Quantity_Sold
                },
                UserID = ticket.UserID
            };

            return Ok(ticketDto);
        }

        // GET: api/Tickets/usertickets/5
        [HttpGet("usertickets/{userid}")]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetUserTickets(int userid)
        {
            var tickets = await _context.Tickets
                .Include(t => t.TicketType) // Include ticket type details
                .Include(t => t.Event) // Include event details
                .Where(t => t.UserID == userid)
                .Select(t => new TicketDto
                {
                    Ticket_ID = t.Ticket_ID,
                    Status = t.Status,
                    QR_Code = t.QR_Code,
                    TicketTypeID = t.TicketTypeID,
                    EventID = t.EventID,
                    TicketType = new TicketTypeDto
                    {
                        ID = t.TicketType.ID,
                        Name = t.TicketType.Name,
                        Price = t.TicketType.Price,
                        Quantity_Total = t.TicketType.Quantity_Total,
                        Quantity_Sold = t.TicketType.Quantity_Sold,
                        EventID = t.TicketType.Event_ID
                    },
                    Event = new EventDto
                    {
                        Event_ID = t.Event.Event_ID,
                        Category = t.Event.Category,
                        Date = t.Event.Date,
                        St_Date = t.Event.St_Date,
                        E_Date = t.Event.E_Date,
                        City = t.Event.City,
                        Location = t.Event.Location,
                        Capacity = t.Event.Capacity,
                        OrganizerID = t.Event.OrganizerID
                    },
                    UserID = t.UserID
                })
                .ToListAsync();

            if (!tickets.Any())
            {
                return NotFound(new { message = "No tickets found for this user" });
            }

            return Ok(tickets);
        }



        // POST: api/Tickets
        [HttpPost]
        public async Task<ActionResult<TicketDto>> CreateTicket(CreateTicketDto createTicketDto)
        {
            // Ensure the ticket type exists
            var ticketType = await _context.TicketTypes.FindAsync(createTicketDto.TicketTypeID);
            if (ticketType == null)
            {
                return BadRequest(new { message = "TicketType not found" });
            }

            // Ensure the event exists
            if (!await _context.Events.AnyAsync(e => e.Event_ID == createTicketDto.EventID))
            {
                return BadRequest(new { message = "Event not found" });
            }

            // Check inventory availability
            if (ticketType.Quantity_Sold >= ticketType.Quantity_Total)
            {
                return BadRequest(new { message = "No more tickets available for this type" });
            }

            // Create the ticket with default status if not provided
            var ticket = new Ticket
            {
                Status = createTicketDto.Status ?? "Available",
                TicketTypeID = createTicketDto.TicketTypeID,
                EventID = createTicketDto.EventID,
                UserID = createTicketDto.UserID
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            // Update inventory: increment sold quantity
            ticketType.Quantity_Sold++;
            await _context.SaveChangesAsync();

            var ticketDto = new TicketDto
            {
                Ticket_ID = ticket.Ticket_ID,
                Status = ticket.Status,
                QR_Code = ticket.QR_Code,
                TicketTypeID = ticket.TicketTypeID,
                EventID = ticket.EventID,
                TicketType = new TicketTypeDto
                {
                    ID = ticketType.ID,
                    Name = ticketType.Name,
                    Price = ticketType.Price,
                    Quantity_Total = ticketType.Quantity_Total,
                    Quantity_Sold = ticketType.Quantity_Sold
                },
                UserID = ticket.UserID
            };

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Ticket_ID }, ticketDto);
        }

        /// Updates an existing ticket's status or QR code.
        /// <returns>NoContent if successful, or NotFound if the ticket doesn't exist.</returns>
        // PUT: api/Tickets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, UpdateTicketDto updateTicketDto)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound(new { message = "Ticket not found" });
            }

            // Update only the fields that were provided
            if (!string.IsNullOrEmpty(updateTicketDto.Status))
                ticket.Status = updateTicketDto.Status;
            if (updateTicketDto.QR_Code != null)
                ticket.QR_Code = updateTicketDto.QR_Code;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Tickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound(new { message = "Ticket not found" });
            }

            // Update inventory: decrement sold quantity if possible
            var ticketType = await _context.TicketTypes.FindAsync(ticket.TicketTypeID);
            if (ticketType != null && ticketType.Quantity_Sold > 0)
            {
                ticketType.Quantity_Sold--;
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}