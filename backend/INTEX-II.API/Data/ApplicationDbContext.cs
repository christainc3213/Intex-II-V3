using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace INTEX_II.API.Data
{
    // ApplicationDbContext class extends IdentityDbContext to manage identity-related tables
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        // Constructor to initialize the DbContext with the provided options
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
