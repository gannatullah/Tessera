using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tessera.API.Models
{
    public class User
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string First_Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Last_Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone_No { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Password { get; set; } = string.Empty;

        public DateTime? DOB { get; set; }

        public Buyer? Buyer { get; set; }
        public Organizer? Organizer { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }

    public class Buyer
    {
        [Key]
        [ForeignKey("User")]
        public int UserID { get; set; }

        [StringLength(50)]
        public string? Nationality { get; set; }

        [StringLength(100)]
        public string? Location { get; set; }

        public User User { get; set; } = null!;
    }

    public class Organizer
    {
        [Key]
        [ForeignKey("User")]
        public int UserID { get; set; }

        public bool IsVerified { get; set; } = false;

        public User User { get; set; } = null!;
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}