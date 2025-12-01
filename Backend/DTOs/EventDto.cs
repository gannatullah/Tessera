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

        [Required]
        public int OrganizerID { get; set; }
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
        public int? Countdown { get; set; }
        public int OrganizerID { get; set; }
    }
}