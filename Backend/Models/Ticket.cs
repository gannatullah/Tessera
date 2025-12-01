using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tessera.API.Models
{
    public class Ticket
    {
        [Key]
        public int Ticket_ID { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Available";

        [StringLength(100)]
        public string? QR_Code { get; set; }

        [Required]
        public int TicketTypeID { get; set; }

        [Required]
        public int EventID { get; set; }

        [ForeignKey("TicketTypeID")]
        public TicketType TicketType { get; set; } = null!;

        [ForeignKey("EventID")]
        public Event Event { get; set; } = null!;

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }

    public class TicketType
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        public int Quantity_Total { get; set; }

        public int Quantity_Sold { get; set; } = 0;

        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}