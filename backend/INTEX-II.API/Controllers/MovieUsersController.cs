using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX_II.API.Data;
using INTEX_II.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class MovieUsersController : ControllerBase
    {
        private readonly MainDbContext _context;

        // Constructor to initialize the database context
        public MovieUsersController(MainDbContext context)
        {
            _context = context;
        }

        // GET: /MovieUsers
        // Retrieves all movie users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieUser>>> GetAll()
        {
            // Query the database to retrieve all movie users
            return await _context.MovieUsers.ToListAsync();
        }

        // GET: /MovieUsers/{id}
        // Retrieves a specific movie user by their ID
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieUser>> GetById(int id)
        {
            // Query the database to find a user by their ID
            var user = await _context.MovieUsers.FindAsync(id);

            // Return 404 Not Found if the user does not exist, otherwise return the user
            return user == null ? NotFound() : user;
        }
    }
}
