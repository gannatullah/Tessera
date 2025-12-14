using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Sockets;

namespace Tessera.API.Models
{
    public class Event
    {
        [Key]
        public int Event_ID { get; set; }

        [Required]
        [StringLength(200)]
        public string Category { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public DateTime St_Date { get; set; }

        [Required]
        public DateTime E_Date { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(200)]
        public string? Location { get; set; }

        public int? Capacity { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? Image { get; set; }

        [Required]
        public int OrganizerID { get; set; }

        [ForeignKey("OrganizerID")]
        public Organizer Organizer { get; set; } = null!;

        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
        public ICollection<TicketType> TicketTypes { get; set; } = new List<TicketType>();
    }
}