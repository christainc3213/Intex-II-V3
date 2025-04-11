using Microsoft.AspNetCore.Authorization; // Provides attributes for authorization.
using Microsoft.AspNetCore.Identity; // Provides identity management functionality.
using Microsoft.AspNetCore.Mvc; // Provides attributes and classes for building APIs.
using Microsoft.AspNetCore.Authorization; // Duplicate import, can be removed if unnecessary.

[ApiController] // Indicates that this class is an API controller.
[Route("[controller]")] // Specifies the route template for this controller.
// [Authorize(Roles = "Administrator")] // Restricts access to users with the "Administrator" role.
public class UserController : ControllerBase // Commented out class declaration, possibly for debugging or refactoring.
{
    private readonly UserManager<IdentityUser> _userManager; // Dependency injection for managing identity users.

    // Constructor to initialize the UserManager dependency.
    public UserController(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("info")] // Defines an HTTP GET endpoint at /[controller]/info.
    public async Task<IActionResult> GetUserInfo()
    {
        // Retrieves the currently authenticated user.
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return NotFound(); // Returns 404 if the user is not found.

        // Retrieves the roles associated with the user.
        var roles = await _userManager.GetRolesAsync(user);

        // Returns user information including email, email confirmation status, and roles.
        return Ok(new
        {
            email = user.Email, // User's email address.
            isEmailConfirmed = user.EmailConfirmed, // Whether the user's email is confirmed.
            roles = roles // List of roles assigned to the user.
        });
    }
}
