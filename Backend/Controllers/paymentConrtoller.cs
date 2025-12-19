using Microsoft.AspNetCore.Mvc;
using Stripe;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    public class PaymentIntentRequest
    {
        public long Amount { get; set; }
        public string? Currency { get; set; }
    }
    [HttpPost("create-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentRequest request)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = request.Amount, // Amount in smallest currency unit (e.g., cents for USD, piastres for EGP)
            Currency = request.Currency ?? "egp",
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true
            }
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options);

        return Ok(new
        {
            clientSecret = intent.ClientSecret
        });
    }
}
