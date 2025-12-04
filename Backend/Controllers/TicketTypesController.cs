using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tessera.API.Data;
using Tessera.API.DTOs;

namespace Tessera.API.Controllers
{
    /// <summary>
    /// Controller for managing ticket types in the system.
    /// Handles retrieval of ticket types for specific events.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TicketTypesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        /// <param name="context">The database context for accessing ticket type data.</param>
        public TicketTypesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TicketTypes/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<TicketTypeDto>>> GetTicketTypesByEvent(int eventId)
        {
            var ticketTypes = await _context.TicketTypes
                .Where(tt => tt.Event_ID == eventId)
                .Select(tt => new TicketTypeDto
                {
                    ID = tt.ID,
                    Name = tt.Name,
                    Price = tt.Price,
                    Quantity_Total = tt.Quantity_Total,
                    Quantity_Sold = tt.Quantity_Sold,
                    EventID = tt.Event_ID
                })
                .ToListAsync();

            if (!ticketTypes.Any())
            {
                return NotFound($"No ticket types found for event with ID {eventId}.");
            }

            return Ok(ticketTypes);
        }
    }
}