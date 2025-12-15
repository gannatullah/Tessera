using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tessera.API.Data;
using Tessera.API.Models;
using Tessera.API.DTOs;

namespace Tessera.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishlistController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Wishlist/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<WishlistDto>>> GetUserWishlist(int userId)
        {
            // Validate that buyer exists
            if (!await _context.Buyers.AnyAsync(b => b.UserID == userId))
            {
                return NotFound(new { message = "User not found" });
            }

            var wishlistItems = await _context.Wishlists
                .Include(w => w.Event)
                    .ThenInclude(e => e.Organizer)
                        .ThenInclude(o => o.User)
                .Include(w => w.Event)
                    .ThenInclude(e => e.TicketTypes)
                .Where(w => w.UserID == userId)
                .Select(w => new WishlistDto
                {
                    ID = w.ID,
                    UserID = w.UserID,
                    EventID = w.EventID,
                    AddedDate = w.AddedDate,
                    Event = new EventDto
                    {
                        Event_ID = w.Event.Event_ID,
                        Name = w.Event.Name,
                        Category = w.Event.Category,
                        Date = w.Event.Date,
                        St_Date = w.Event.St_Date,
                        E_Date = w.Event.E_Date,
                        City = w.Event.City,
                        Location = w.Event.Location,
                        Capacity = w.Event.Capacity,
                        Description = w.Event.Description,
                        Image = w.Event.Image,
                        OrganizerID = w.Event.OrganizerID,
                        Organizer = new OrganizerDto
                        {
                            UserID = w.Event.Organizer.UserID,
                            IsVerified = w.Event.Organizer.IsVerified,
                            User = new UserDto
                            {
                                ID = w.Event.Organizer.User.ID,
                                Name = w.Event.Organizer.User.Name,
                                First_Name = w.Event.Organizer.User.First_Name,
                                Last_Name = w.Event.Organizer.User.Last_Name,
                                Email = w.Event.Organizer.User.Email,
                                Phone_No = w.Event.Organizer.User.Phone_No,
                                DOB = w.Event.Organizer.User.DOB,
                                ProfilePic = w.Event.Organizer.User.ProfilePic
                            }
                        },
                        TicketTypes = w.Event.TicketTypes.Select(tt => new TicketTypeDto
                        {
                            ID = tt.ID,
                            Name = tt.Name,
                            Price = tt.Price,
                            Quantity_Total = tt.Quantity_Total,
                            Quantity_Sold = tt.Quantity_Sold,
                            EventID = tt.Event_ID
                        }).ToList()
                    }
                })
                .ToListAsync();

            return Ok(wishlistItems);
        }

        // GET: api/Wishlist/check/{userId}/{eventId}
        [HttpGet("check/{userId}/{eventId}")]
        public async Task<ActionResult<bool>> CheckWishlistItem(int userId, int eventId)
        {
            var exists = await _context.Wishlists
                .AnyAsync(w => w.UserID == userId && w.EventID == eventId);

            return Ok(new { exists });
        }

        // POST: api/Wishlist
        [HttpPost]
        public async Task<ActionResult<WishlistDto>> AddToWishlist(CreateWishlistDto createWishlistDto)
        {
            // Validate that buyer exists
            if (!await _context.Buyers.AnyAsync(b => b.UserID == createWishlistDto.UserID))
            {
                return BadRequest(new { message = "User not found" });
            }

            // Validate that event exists
            if (!await _context.Events.AnyAsync(e => e.Event_ID == createWishlistDto.EventID))
            {
                return BadRequest(new { message = "Event not found" });
            }

            // Check if already in wishlist
            if (await _context.Wishlists.AnyAsync(w => w.UserID == createWishlistDto.UserID && w.EventID == createWishlistDto.EventID))
            {
                return BadRequest(new { message = "Event already in wishlist" });
            }

            var wishlistItem = new Wishlist
            {
                UserID = createWishlistDto.UserID,
                EventID = createWishlistDto.EventID,
                AddedDate = DateTime.UtcNow
            };

            _context.Wishlists.Add(wishlistItem);
            await _context.SaveChangesAsync();

            var wishlistDto = new WishlistDto
            {
                ID = wishlistItem.ID,
                UserID = wishlistItem.UserID,
                EventID = wishlistItem.EventID,
                AddedDate = wishlistItem.AddedDate
            };

            return CreatedAtAction(nameof(GetUserWishlist), new { userId = wishlistItem.UserID }, wishlistDto);
        }

        // DELETE: api/Wishlist/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWishlistItem(int id)
        {
            var wishlistItem = await _context.Wishlists.FindAsync(id);

            if (wishlistItem == null)
            {
                return NotFound(new { message = "Wishlist item not found" });
            }

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Wishlist/user/{userId}/event/{eventId}
        [HttpDelete("user/{userId}/event/{eventId}")]
        public async Task<IActionResult> DeleteWishlistItemByUserAndEvent(int userId, int eventId)
        {
            var wishlistItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserID == userId && w.EventID == eventId);

            if (wishlistItem == null)
            {
                return NotFound(new { message = "Wishlist item not found" });
            }

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
