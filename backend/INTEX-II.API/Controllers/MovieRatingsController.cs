using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX_II.API.Data;
using INTEX_II.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("api/ratings")]
    [Authorize]
    public class MovieRatingsController : ControllerBase
    {
        private readonly MainDbContext _context;

        // Constructor to initialize the database context
        public MovieRatingsController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/ratings/{userId}/{showId}
        // Retrieves the rating for a specific user and movie
        [HttpGet("{userId}/{showId}")]
        public async Task<ActionResult<MovieRating>> GetRating(int userId, string showId)
        {
            // Query the database for the rating matching the userId and showId
            var rating = await _context.MovieRatings
                .FirstOrDefaultAsync(r => r.user_id == userId && r.show_id == showId);

            // If no rating is found, return a 404 Not Found response
            if (rating == null)
            {
                return NotFound();
            }

            // Return the rating if found
            return Ok(rating);
        }

        // POST: api/ratings
        // Adds a new rating or updates an existing one
        [HttpPost]
        public async Task<IActionResult> AddOrUpdateRating([FromBody] MovieRating rating)
        {
            // Check if a rating already exists for the given userId and showId
            var existing = await _context.MovieRatings
                .FirstOrDefaultAsync(r => r.user_id == rating.user_id && r.show_id == rating.show_id);

            if (existing != null)
            {
                // If the rating exists, update the rating value
                existing.rating = rating.rating;
                _context.MovieRatings.Update(existing);
            }
            else
            {
                // If the rating does not exist, add it as a new entry
                _context.MovieRatings.Add(rating);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return the added or updated rating
            return Ok(rating);
        }
    }
}
