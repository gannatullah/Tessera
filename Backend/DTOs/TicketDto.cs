using System.ComponentModel.DataAnnotations;

namespace Tessera.API.DTOs
{
    public class CreateTicketDto
    {
        [Required]
        public int TicketTypeID { get; set; }

        [Required]
        public int EventID { get; set; }

        public string? Status { get; set; } = "Available";
        public int ? UserID { get; set; }
    }

    public class UpdateTicketDto
    {
        public string? Status { get; set; }
        public string? QR_Code { get; set; }
    }

    public class TicketDto
    {
        public int Ticket_ID { get; set; }
        public string Status { get; set; } = "Available";
        public string? QR_Code { get; set; }
        public int TicketTypeID { get; set; }
        public int EventID { get; set; }
        public int? UserID { get; set; }
        public TicketTypeDto? TicketType { get; set; }
    }

    public class TicketTypeDto
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity_Total { get; set; }
        public int Quantity_Sold { get; set; }
        public int EventID { get; set; }
    }
}