using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

public class CustomEmailSender<TUser> : IEmailSender<TUser> where TUser : class
{
    private readonly string _smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? "smtp.gmail.com";
    private readonly int _smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? 587);
    private readonly string _smtpUser = Environment.GetEnvironmentVariable("SMTP_USER") ?? "nichecine@gmail.com";
    private readonly string _smtpPass = Environment.GetEnvironmentVariable("SMTP_PASS") ?? "cuqo loar qgqf byxx"; // Your Gmail app-specific password

    public async Task SendEmailAsync(TUser user, string subject, string message)
    {
        // Extract the user's email address
        var email = (user as IdentityUser)?.Email ?? throw new InvalidOperationException("User email not found.");

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_smtpUser, "CineNiche"), // Replace "CineNiche" with your app name
            Subject = subject,
            Body = message,
            IsBodyHtml = true // Set to true if the email body contains HTML
        };

        mailMessage.To.Add(email);

        using var smtpClient = new SmtpClient(_smtpHost, _smtpPort)
        {
            Credentials = new NetworkCredential(_smtpUser, _smtpPass),
            EnableSsl = true // Enable SSL for secure email sending
        };

        await smtpClient.SendMailAsync(mailMessage);
    }
}