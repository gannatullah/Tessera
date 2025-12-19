namespace Tessera.API.DTOs
{
    public class LoginResponseDto
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone_No { get; set; } = string.Empty;
        public DateTime? DOB { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}