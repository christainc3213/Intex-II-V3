using Microsoft.AspNetCore.Mvc;
using INTEX_II.API.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MfaController : ControllerBase
    {
        private readonly MfaService _mfaService;

        public MfaController(MfaService mfaService)
        {
            _mfaService = mfaService;
        }

        [HttpGet("qrcode")]
        public IActionResult GetQrCode()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null)
                return Unauthorized();

            //var secretKey = _mfaService.GenerateSecretKey(); // You can later store this for the user
            var secretKey = HttpContext.Session.GetString("SecretKey");
            if (string.IsNullOrEmpty(secretKey))
            {
                secretKey = _mfaService.GenerateSecretKey();
                HttpContext.Session.SetString("SecretKey", secretKey);
            }

            var svg = _mfaService.GenerateSvgQRCode(email, secretKey);

            return Ok(new
            {
                email,
                secretKey,
                svg
            });
        }

        public class VerifyCodeRequest
        {
            public string Code { get; set; }
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeRequest request, [FromServices] UserManager<IdentityUser> userManager)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            var secretKey = HttpContext.Session.GetString("SecretKey");
            if (string.IsNullOrEmpty(secretKey))
                return BadRequest(new { message = "No secret key found in session" });

            var totp = new OtpNet.Totp(OtpNet.Base32Encoding.ToBytes(secretKey));
            bool isValid = totp.VerifyTotp(request.Code, out long timeStepMatched, new OtpNet.VerificationWindow(2, 2));

            if (!isValid)
                return BadRequest(new { message = "Invalid verification code" });

            await userManager.SetTwoFactorEnabledAsync(user, true);
            HttpContext.Session.Remove("SecretKey");

            return Ok(new { message = "2FA enabled successfully!" });
        }

    }
}
