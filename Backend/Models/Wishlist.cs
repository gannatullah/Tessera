using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tessera.API.Models
{
    public class Wishlist
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int EventID { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserID")]
        public Buyer Buyer { get; set; } = null!;

        [ForeignKey("EventID")]
        public Event Event { get; set; } = null!;
    }
}
