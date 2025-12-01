using System.ComponentModel.DataAnnotations;

namespace Tessera.API.DTOs
{
    public class CreateOrganizerDto
    {
        [Required]
        public int UserID { get; set; }

        public bool IsVerified { get; set; } = false;
    }

    public class UpdateOrganizerDto
    {
        public bool? IsVerified { get; set; }
    }

    public class OrganizerDto
    {
        public int UserID { get; set; }
        public bool IsVerified { get; set; }
        public UserDto? User { get; set; }
    }
}