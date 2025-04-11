using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX_II.API.Data;
using INTEX_II.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
 //   [Authorize]
    public class MovieTitlesController : ControllerBase
    {
        private readonly MainDbContext _context;

        // Constructor to initialize the database context
        public MovieTitlesController(MainDbContext context)
        {
            _context = context;
        }

        // GET: /MovieTitles
        // Retrieves all movie titles (up to 9000 entries)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieTitle>>> GetAll()
        {
            // Query the database to retrieve up to 9000 movie titles
            return await _context.MovieTitles.Take(9000).ToListAsync();
        }

        // GET: /MovieTitles/{id}
        // Retrieves a specific movie title by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieTitle>> GetById(string id)
        {
            // Query the database to find a movie by its ID
            var movie = await _context.MovieTitles.FindAsync(id);

            // Return 404 Not Found if the movie does not exist, otherwise return the movie
            return movie == null ? NotFound() : movie;
        }
    }
}
