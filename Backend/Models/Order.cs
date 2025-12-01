using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tessera.API.Models
{
    public class Order
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Total_Amount { get; set; }

        [Required]
        public DateTime Order_Date { get; set; } = DateTime.UtcNow;

        [Required]
        public int UserID { get; set; }

        [ForeignKey("UserID")]
        public User User { get; set; } = null!;

        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}