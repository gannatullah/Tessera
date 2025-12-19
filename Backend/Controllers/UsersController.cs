using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tessera.API.Data;
using Tessera.API.Models;
using Tessera.API.DTOs;

namespace Tessera.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    ID = u.ID,
                    Name = u.Name,
                    First_Name = u.First_Name,
                    Last_Name = u.Last_Name,
                    Email = u.Email,
                    Phone_No = u.Phone_No,
                    DOB = u.DOB,
                    ProfilePic = u.ProfilePic,
                    Location = u.Location,
                    Bio = u.Bio
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var userDto = new UserDto
            {
                ID = user.ID,
                Name = user.Name,
                First_Name = user.First_Name,
                Last_Name = user.Last_Name,
                Email = user.Email,
                Phone_No = user.Phone_No,
                DOB = user.DOB,
                ProfilePic = user.ProfilePic,
                Location = user.Location,
                Bio = user.Bio
            };

            return Ok(userDto);
        }


        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == createUserDto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var user = new User
            {
                Name = createUserDto.Name,
                First_Name = createUserDto.First_Name,
                Last_Name = createUserDto.Last_Name,
                Email = createUserDto.Email,
                Phone_No = createUserDto.Phone_No,
                Password = createUserDto.Password, // In production, hash this!
                DOB = createUserDto.DOB,
                ProfilePic = createUserDto.ProfilePic,
                Location = createUserDto.Location,
                Bio = createUserDto.Bio
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create Buyer or Organizer based on UserType
            // All users get a Buyer record so they can purchase tickets
            var buyer = new Buyer
            {
                UserID = user.ID
            };
            _context.Buyers.Add(buyer);

            if (createUserDto.UserType.ToLower() == "organizer")
            {
                var organizer = new Organizer
                {
                    UserID = user.ID,
                    IsVerified = false // Default to not verified
                };
                _context.Organizers.Add(organizer);
            }

            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                ID = user.ID,
                Name = user.Name,
                First_Name = user.First_Name,
                Last_Name = user.Last_Name,
                Email = user.Email,
                Phone_No = user.Phone_No,
                DOB = user.DOB,
                ProfilePic = user.ProfilePic,
                Location = user.Location,
                Bio = user.Bio
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.ID }, userDto);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(updateUserDto.Name))
                user.Name = updateUserDto.Name;
            if (!string.IsNullOrEmpty(updateUserDto.First_Name))
                user.First_Name = updateUserDto.First_Name;
            if (!string.IsNullOrEmpty(updateUserDto.Last_Name))
                user.Last_Name = updateUserDto.Last_Name;
            if (!string.IsNullOrEmpty(updateUserDto.Email))
                user.Email = updateUserDto.Email;
            if (!string.IsNullOrEmpty(updateUserDto.Phone_No))
                user.Phone_No = updateUserDto.Phone_No;
            if (updateUserDto.DOB.HasValue)
                user.DOB = updateUserDto.DOB;
            if (!string.IsNullOrEmpty(updateUserDto.ProfilePic))
                user.ProfilePic = updateUserDto.ProfilePic;

            if (!string.IsNullOrEmpty(updateUserDto.Location))
                user.Location = updateUserDto.Location;

            if (!string.IsNullOrEmpty(updateUserDto.Bio))
                user.Bio = updateUserDto.Bio;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromServices] Services.JwtService jwtService,LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return NotFound(new { message = "Invalid email or password" });
            }

            if (user.Password != loginDto.Password)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Generate JWT token
            var token = jwtService.GenerateToken(user.ID, user.Email, user.Name);

            var response = new LoginResponseDto
            {
                ID = user.ID,
                Name = user.Name,
                First_Name = user.First_Name,
                Last_Name = user.Last_Name,
                Email = user.Email,
                Phone_No = user.Phone_No,
                DOB = user.DOB,
                Location = user.Location,
                Bio = user.Bio,
                Token = token
            };

            return Ok(response);
        }
    }
}