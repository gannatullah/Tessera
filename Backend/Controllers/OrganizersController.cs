using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tessera.API.Data;
using Tessera.API.Models;
using Tessera.API.DTOs;

namespace Tessera.API.Controllers
{
    /// <summary>
    /// Controller for managing organizers in the system.
    /// Organizers are users who can create and manage events.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        /// <summary>
        /// Initializes a new instance of the OrganizersController.
        /// </summary>
        /// <param name="context">The database context for accessing organizer data.</param>
        public OrganizersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a list of all organizers with their user details.
        /// </summary>
        /// <returns>A list of OrganizerDto objects containing organizer and user information.</returns>
        // GET: api/Organizers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrganizerDto>>> GetOrganizers()
        {
            var organizers = await _context.Organizers
                .Include(o => o.User) // Include user details in the query
                .Select(o => new OrganizerDto
                {
                    UserID = o.UserID,
                    IsVerified = o.IsVerified,
                    User = new UserDto
                    {
                        ID = o.User.ID,
                        Name = o.User.Name,
                        First_Name = o.User.First_Name,
                        Last_Name = o.User.Last_Name,
                        Email = o.User.Email,
                        Phone_No = o.User.Phone_No,
                        DOB = o.User.DOB
                    }
                })
                .ToListAsync();

            return Ok(organizers);
        }

        /// <summary>
        /// Retrieves a specific organizer by their UserID.
        /// </summary>
        /// <param name="id">The UserID of the organizer to retrieve.</param>
        /// <returns>An OrganizerDto object if found, or NotFound if the organizer doesn't exist.</returns>
        // GET: api/Organizers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrganizerDto>> GetOrganizer(int id)
        {
            var organizer = await _context.Organizers
                .Include(o => o.User) // Include user details
                .FirstOrDefaultAsync(o => o.UserID == id);

            if (organizer == null)
            {
                return NotFound(new { message = "Organizer not found" });
            }

            var organizerDto = new OrganizerDto
            {
                UserID = organizer.UserID,
                IsVerified = organizer.IsVerified,
                User = new UserDto
                {
                    ID = organizer.User.ID,
                    Name = organizer.User.Name,
                    First_Name = organizer.User.First_Name,
                    Last_Name = organizer.User.Last_Name,
                    Email = organizer.User.Email,
                    Phone_No = organizer.User.Phone_No,
                    DOB = organizer.User.DOB
                }
            };

            return Ok(organizerDto);
        }

        /// <summary>
        /// Creates a new organizer for an existing user.
        /// </summary>
        /// <param name="createOrganizerDto">The data transfer object containing the UserID and verification status.</param>
        /// <returns>The created OrganizerDto, or BadRequest if the user doesn't exist or is already an organizer.</returns>
        // POST: api/Organizers
        [HttpPost]
        public async Task<ActionResult<OrganizerDto>> CreateOrganizer(CreateOrganizerDto createOrganizerDto)
        {
            // Validate that the user exists in the system
            var user = await _context.Users.FindAsync(createOrganizerDto.UserID);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            // Prevent creating duplicate organizers for the same user
            if (await _context.Organizers.AnyAsync(o => o.UserID == createOrganizerDto.UserID))
            {
                return BadRequest(new { message = "User is already an organizer" });
            }

            // Create the new organizer record
            var organizer = new Organizer
            {
                UserID = createOrganizerDto.UserID,
                IsVerified = createOrganizerDto.IsVerified
            };

            _context.Organizers.Add(organizer);
            await _context.SaveChangesAsync();

            // Return the created organizer with user details
            var organizerDto = new OrganizerDto
            {
                UserID = organizer.UserID,
                IsVerified = organizer.IsVerified,
                User = new UserDto
                {
                    ID = user.ID,
                    Name = user.Name,
                    First_Name = user.First_Name,
                    Last_Name = user.Last_Name,
                    Email = user.Email,
                    Phone_No = user.Phone_No,
                    DOB = user.DOB
                }
            };

            return CreatedAtAction(nameof(GetOrganizer), new { id = organizer.UserID }, organizerDto);
        }

        /// <summary>
        /// Updates an existing organizer's information.
        /// </summary>
        /// <param name="id">The UserID of the organizer to update.</param>
        /// <param name="updateOrganizerDto">The data transfer object containing updated fields.</param>
        /// <returns>NoContent if successful, or NotFound if the organizer doesn't exist.</returns>
        // PUT: api/Organizers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrganizer(int id, UpdateOrganizerDto updateOrganizerDto)
        {
            var organizer = await _context.Organizers.FindAsync(id);

            if (organizer == null)
            {
                return NotFound(new { message = "Organizer not found" });
            }

            // Update only the fields that were provided in the request
            if (updateOrganizerDto.IsVerified.HasValue)
                organizer.IsVerified = updateOrganizerDto.IsVerified.Value;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Deletes an organizer from the system.
        /// </summary>
        /// <param name="id">The UserID of the organizer to delete.</param>
        /// <returns>NoContent if successful, or NotFound if the organizer doesn't exist.</returns>
        // DELETE: api/Organizers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrganizer(int id)
        {
            var organizer = await _context.Organizers.FindAsync(id);

            if (organizer == null)
            {
                return NotFound(new { message = "Organizer not found" });
            }

            _context.Organizers.Remove(organizer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}