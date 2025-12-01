using System.ComponentModel.DataAnnotations;

namespace Tessera.API.DTOs
{
    // For creating a new user
    public class CreateUserDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string First_Name { get; set; } = string.Empty;

        [Required]
        public string Last_Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Phone_No { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public DateTime? DOB { get; set; }
    }

    // For updating user
    public class UpdateUserDto
    {
        public string? Name { get; set; }
        public string? First_Name { get; set; }
        public string? Last_Name { get; set; }
        public string? Email { get; set; }
        public string? Phone_No { get; set; }
        public DateTime? DOB { get; set; }
    }

    // For returning user data (without password)
    public class UserDto
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone_No { get; set; } = string.Empty;
        public DateTime? DOB { get; set; }
    }
}