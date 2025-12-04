using System.ComponentModel.DataAnnotations;
namespace Tessera.API.DTOs
{
    public class CreateBuyerDto
    {
        [Required]
        public int UserID { get; set; }
    }

    public class UpdateBuyerDto
    {
        // No updatable fields for Buyer as of now
    }

    public class BuyerDto
    {
        public int UserID { get; set; }
        public UserDto? User { get; set; }
    }
}