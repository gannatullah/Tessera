public class QrCodeService
{
    public string GenerateQrCodeUrl(string data, string type)
    {
        return
            $"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={Uri.EscapeDataString(data)}&type={Uri.EscapeDataString(type)}";
    }
}
