using System.Drawing.Imaging;
using System.Drawing;
using System.Security.Cryptography;
using QRCoder;


namespace INTEX_II.API.Services
{
    public class MfaService
    {
        public string GenerateSecretKey()
        {
            byte[] key = new byte[32]; // 256-bit key
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(key); // Generate random bytes
            }
            return Convert.ToBase64String(key); // Encode as Base64 string
        }

        public string GenerateSvgQRCode(string email, string secretKey)
        {
            string otpAuthUrl = $"otpauth://totp/MyApp:{Uri.EscapeDataString(email)}?secret={secretKey}&issuer=MyApp";

            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(otpAuthUrl, QRCodeGenerator.ECCLevel.Q);
                var svgQrCode = new SvgQRCode(qrCodeData);
                return svgQrCode.GetGraphic(4); // returns an SVG string
            }
        }

    }
}
