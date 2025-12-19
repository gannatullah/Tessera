using System.Net.Http.Json;
using Tessera.API.Models;

public class N8nService
{
    private readonly HttpClient _http;
    private readonly ILogger<N8nService>? _logger;
    private readonly string url = "https://mennaamr.app.n8n.cloud/webhook/ticket-confirmation";

    public N8nService(HttpClient http, ILogger<N8nService> logger)
    {
        _http = http ?? throw new ArgumentNullException(nameof(http));
        _logger = logger;
    }

    public async Task SendTicketConfirmationAsync(Ticket ticket)
    {
        var payload = new
        {
            ticketId = ticket.Ticket_ID,
            userEmail = ticket.Buyer?.User?.Email ?? "N/A",
            userName = ticket.Buyer?.User?.Name ?? "N/A",
            eventName = ticket.Event?.Name ?? "N/A",
            date = ticket.Event?.Date.ToString("yyyy-MM-dd") ?? "N/A",
            verifyUrl = $"http://localhost:5000/api/tickets/{ticket.Ticket_ID}",
            QRCodeUrl = ticket.QR_Code
        };

        _logger?.LogInformation("SendTicketConfirmationAsync CALLED");

        var response = await _http.PostAsJsonAsync(url, payload);

        var body = await response.Content.ReadAsStringAsync();
        _logger?.LogInformation("n8n Status: {Status}", response.StatusCode);
        _logger?.LogInformation("n8n Body: {Body}", body);
    }
}
