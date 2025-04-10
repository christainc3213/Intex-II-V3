using INTEX_II.API.Models;
using Microsoft.EntityFrameworkCore;

namespace INTEX_II.API.Data
{
    // MainDbContext class represents the database context for the application
    public class MainDbContext : DbContext
    {
        // Constructor to initialize the DbContext with the provided options
        public MainDbContext(DbContextOptions<MainDbContext> options) : base(options)
        {
        }

        // DbSet for the MovieTitles table
        public DbSet<MovieTitle> MovieTitles { get; set; }

        // DbSet for the MovieRatings table
        public DbSet<MovieRating> MovieRatings { get; set; }

        // DbSet for the MovieUsers table
        public DbSet<MovieUser> MovieUsers { get; set; }

        // Configures the database schema and relationships
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map the MovieTitle entity to the "movies_titles" table
            modelBuilder.Entity<MovieTitle>().ToTable("movies_titles");

            // Map the MovieUser entity to the "movies_users" table
            modelBuilder.Entity<MovieUser>().ToTable("movies_users");

            // Map the MovieRating entity to the "movies_ratings" table
            // Configure a composite primary key for the MovieRating table
            modelBuilder.Entity<MovieRating>()
                .ToTable("movies_ratings")
                .HasKey(r => new { r.user_id, r.show_id });
        }
    }
}