using System.Security.Claims;
using INTEX_II.API.Data;
using INTEX_II.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DATABASES
builder.Services.AddDbContext<MainDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MainDbConnection")));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddDbContext<InteractionDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("InteractionConnection")));

// IDENTITY
builder.Services.AddAuthorization();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 12;
    options.Password.RequiredUniqueChars = 1;

    options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider; // Enable email token provider
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "https://gray-desert-04c503d1e.6.azurestaticapps.net")
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("Content-Security-Policy");
        });
});

builder.Services.AddSingleton<IEmailSender<IdentityUser>, CustomEmailSender<IdentityUser>>();

builder.Services.AddSingleton<Microsoft.AspNetCore.Identity.UI.Services.IEmailSender>(
    sp => sp.GetRequiredService<IEmailSender<IdentityUser>>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<IdentityUser>();

app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        Path = "/",
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

app.MapGet("/pingauth", (HttpContext context, ClaimsPrincipal user) =>
{
    Console.WriteLine($"User authenticated? {user.Identity?.IsAuthenticated}");

    if (!user.Identity?.IsAuthenticated ?? false)
    {
        Console.WriteLine("Unauthorized request to /pingauth");
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    Console.WriteLine($"Authenticated User Email: {email}");

    return Results.Json(new { email = email });
});

// Endpoint to send MFA code via email
app.MapPost("/send-mfa-code", async (HttpContext context, UserManager<IdentityUser> userManager, IEmailSender<IdentityUser> emailSender) =>
{
    var user = await userManager.GetUserAsync(context.User);
    if (user == null)
    {
        return Results.Unauthorized();
    }

    // Generate a token for MFA
    var token = await userManager.GenerateTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider);

    // Send the token via email
    await emailSender.SendEmailAsync(user, "Your MFA Code", $"Your MFA code is: {token}");

    return Results.Ok(new { message = "MFA code sent to your email." });
}).RequireAuthorization();

// Endpoint to verify MFA code
app.MapPost("/verify-mfa-code", async (HttpContext context, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager) =>
{
    var user = await userManager.GetUserAsync(context.User);
    if (user == null)
    {
        return Results.Unauthorized();
    }

    // Read the MFA code from the request body
    var requestBody = await context.Request.ReadFromJsonAsync<MfaVerificationRequest>();
    if (requestBody == null || string.IsNullOrEmpty(requestBody.Code))
    {
        return Results.BadRequest(new { message = "Invalid MFA code." });
    }

    // Verify the MFA code
    var isValid = await userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider, requestBody.Code);
    if (!isValid)
    {
        return Results.Unauthorized(new { message = "Invalid MFA code." });
    }

    // Sign in the user after successful MFA verification
    await signInManager.SignInAsync(user, isPersistent: true);

    return Results.Ok(new { message = "MFA verification successful." });
}).RequireAuthorization();

// Record to handle MFA verification request
public record MfaVerificationRequest(string Code);

app.Run();
