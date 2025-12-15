using System.ComponentModel.DataAnnotations;

namespace Tessera.API.DTOs
{
    public class CreateWishlistDto
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public int EventID { get; set; }
    }

    public class WishlistDto
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public int EventID { get; set; }
        public DateTime AddedDate { get; set; }
        public EventDto? Event { get; set; }
    }
}
