using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tessera.API.Data;
using Tessera.API.DTOs;

namespace Tessera.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class BuyersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BuyersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Buyers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BuyerDto>>> GetBuyers()
        {
            var buyers = await _context.Buyers
                .Include(b => b.User) // Include user details in the query
                .Select(b => new BuyerDto
                {
                    UserID = b.UserID,
                    User = new UserDto
                    {
                        ID = b.User.ID,
                        Name = b.User.Name,
                        First_Name = b.User.First_Name,
                        Last_Name = b.User.Last_Name,
                        Email = b.User.Email,
                        Phone_No = b.User.Phone_No,
                        DOB = b.User.DOB
                    }
                })
                .ToListAsync();

            return Ok(buyers);
        }

        /// <summary>
        /// Retrieves a specific buyer by their UserID.
        /// </summary>
        /// <param name="id">The UserID of the buyer to retrieve.</param>
        /// <returns>A BuyerDto object if found, or NotFound if the buyer doesn't exist.</returns>
        // GET: api/Buyers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BuyerDto>> GetBuyer(int id)
        {
            var buyer = await _context.Buyers
                .Include(b => b.User) // Include user details
                .FirstOrDefaultAsync(b => b.UserID == id);

            if (buyer == null)
            {
                return NotFound(new { message = "Buyer not found" });
            }

            var buyerDto = new BuyerDto
            {
                UserID = buyer.UserID,
                User = new UserDto
                {
                    ID = buyer.User.ID,
                    Name = buyer.User.Name,
                    First_Name = buyer.User.First_Name,
                    Last_Name = buyer.User.Last_Name,
                    Email = buyer.User.Email,
                    Phone_No = buyer.User.Phone_No,
                    DOB = buyer.User.DOB
                }
            };

            return Ok(buyerDto);
        }
    }
}