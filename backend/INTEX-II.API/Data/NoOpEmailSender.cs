using Microsoft.AspNetCore.Identity;

namespace INTEX_II.API.Data;

// NoOpEmailSender class is a placeholder implementation of the IEmailSender interface
// It performs no actual email-sending operations and is useful for testing or development purposes
public class NoOpEmailSender<TUser> : IEmailSender<TUser> where TUser : class
{
    // Simulates sending a confirmation link email (does nothing)
    public Task SendConfirmationLinkAsync(TUser user, string email, string confirmationLink) =>
        Task.CompletedTask;

    // Simulates sending a password reset link email (does nothing)
    public Task SendPasswordResetLinkAsync(TUser user, string email, string resetLink) =>
        Task.CompletedTask;

    // Throws a NotImplementedException for sending a password reset code
    public Task SendPasswordResetCodeAsync(TUser user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    // Simulates sending a generic email (does nothing)
    public Task SendEmailAsync(TUser user, string email, string subject, string htmlMessage) =>
        Task.CompletedTask;
}