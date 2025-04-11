using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
 //   [Authorize]
    public class DetailsRecommendationController : ControllerBase
    {
        private readonly IConfiguration _config;

        // Constructor to initialize the configuration for database connection
        public DetailsRecommendationController(IConfiguration config)
        {
            _config = config;
        }

        // Private method to retrieve recommendations from the database
        private List<string> GetRecommendations(string table, string showId)
        {
            var recs = new List<string>();

            // Establish a connection to the SQLite database
            using var conn = new SqliteConnection(_config.GetConnectionString("MainDbConnection"));
            conn.Open();

            // Query to retrieve recommendations for the given showId from the specified table
            var query = $"SELECT * FROM {table} WHERE show_id = @showId";
            using var cmd = new SqliteCommand(query, conn);
            cmd.Parameters.AddWithValue("@showId", showId);

            // Execute the query and read the results
            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                // Loop through the recommendation columns (e.g., Recommendation 1 to Recommendation 10)
                for (int i = 1; i <= 10; i++)
                {
                    recs.Add(reader[$"Recommendation {i}"].ToString());
                }
            }

            return recs; // Return the list of recommendations
        }

        // GET: api/DetailsRecommendation/content/{showId}
        // Retrieves content-based recommendations for a specific show
        [HttpGet("content/{showId}")]
        public IActionResult GetContentRecommendations(string showId) =>
            Ok(GetRecommendations("content_rec", showId));

        // GET: api/DetailsRecommendation/collab/{showId}
        // Retrieves collaborative filtering recommendations for a specific show
        [HttpGet("collab/{showId}")]
        public IActionResult GetCollabRecommendations(string showId) =>
            Ok(GetRecommendations("collab_details_rec", showId));

        // GET: api/DetailsRecommendation/action/{showId}
        // Retrieves action genre-specific recommendations for a specific show
        [HttpGet("action/{showId}")]
        public IActionResult GetActionRecommendations(string showId) =>
            Ok(GetRecommendations("act_collab_details_rec", showId));

        // GET: api/DetailsRecommendation/comedy/{showId}
        // Retrieves comedy genre-specific recommendations for a specific show
        [HttpGet("comedy/{showId}")]
        public IActionResult GetComedyRecommendations(string showId) =>
            Ok(GetRecommendations("com_collab_details_rec", showId));

        // GET: api/DetailsRecommendation/drama/{showId}
        // Retrieves drama genre-specific recommendations for a specific show
        [HttpGet("drama/{showId}")]
        public IActionResult GetDramaRecommendations(string showId) =>
            Ok(GetRecommendations("dram_collab_details_rec", showId));
    }
}
