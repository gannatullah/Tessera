using System.ComponentModel.DataAnnotations;

namespace Tessera.API.DTOs
{
    public class CreateEventDto
    {
        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public DateTime St_Date { get; set; }

        [Required]
        public DateTime E_Date { get; set; }

        public string? City { get; set; }
        public string? Location { get; set; }
        public int? Capacity { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }

        [Required]
        public int OrganizerID { get; set; }
        
        public List<CreateTicketTypeDto>? TicketTypes { get; set; }
    }

    public class CreateTicketTypeDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity_Total { get; set; }
    }

    public class UpdateEventDto
    {
        public string? Category { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? St_Date { get; set; }
        public DateTime? E_Date { get; set; }
        public string? City { get; set; }
        public string? Location { get; set; }
        public int? Capacity { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
    }

    public class EventDto
    {
        public int Event_ID { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime St_Date { get; set; }
        public DateTime E_Date { get; set; }
        public string? City { get; set; }
        public string? Location { get; set; }
        public int? Capacity { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public int OrganizerID { get; set; }
        public OrganizerDto? Organizer { get; set; }
        public List<TicketTypeDto>? TicketTypes { get; set; }
    }
}