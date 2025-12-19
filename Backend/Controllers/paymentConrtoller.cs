using Microsoft.AspNetCore.Mvc;
using Stripe;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    [HttpPost("create-intent")]
    public async Task<IActionResult> CreatePaymentIntent()
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = 10000, // 100 EGP (Stripe uses smallest unit)
            Currency = "egp",
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
