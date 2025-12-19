public class QrCodeService
{
    public string GenerateQrCodeUrl(string data)
    {
        return
            $"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={Uri.EscapeDataString(data)}";
    }
}
