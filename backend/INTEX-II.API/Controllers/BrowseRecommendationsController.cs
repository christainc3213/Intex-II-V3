using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
 //   [Authorize]
    public class BrowseRecommendationsController : ControllerBase
    {
        private readonly string _connectionString;

        // Constructor to initialize the SQLite connection string
        public BrowseRecommendationsController()
        {
            _connectionString = "Data Source=MainDb.sqlite";
        }

        // GET: api/BrowseRecommendations/genre/action/{userId}
        // Retrieves action genre-specific recommendations for a user
        [HttpGet("genre/action/{userId}")]
        public IActionResult GetActionRecommendations(int userId)
        {
            return GetGenreRecommendations("action", userId);
        }

        // GET: api/BrowseRecommendations/genre/comedies/{userId}
        // Retrieves comedy genre-specific recommendations for a user
        [HttpGet("genre/comedies/{userId}")]
        public IActionResult GetComedyRecommendations(int userId)
        {
            return GetGenreRecommendations("comedies", userId);
        }

        // GET: api/BrowseRecommendations/genre/dramas/{userId}
        // Retrieves drama genre-specific recommendations for a user
        [HttpGet("genre/dramas/{userId}")]
        public IActionResult GetDramaRecommendations(int userId)
        {
            return GetGenreRecommendations("dramas", userId);
        }

        // Private method to retrieve recommendations for a specific genre and user
        private IActionResult GetGenreRecommendations(string genre, int userId)
        {
            // Map genre to the corresponding database table
            string tableName = genre switch
            {
                "action" => "act_collab_browse_rec",
                "comedies" => "com_collab_browse_rec",
                "dramas" => "dram_collab_browse_rec",
                _ => null
            };

            // Return 404 if the genre is not supported
            if (tableName == null)
                return NotFound($"Genre '{genre}' is not supported.");

            var recommendations = new List<string>();

            // Establish a connection to the SQLite database
            using var connection = new SqliteConnection(_connectionString);
            connection.Open();

            // Query to retrieve recommendations for the user from the specified table
            var command = connection.CreateCommand();
            command.CommandText = $@"
                SELECT 
                    [Recommendation 1], [Recommendation 2], [Recommendation 3],
                    [Recommendation 4], [Recommendation 5], [Recommendation 6],
                    [Recommendation 7], [Recommendation 8], [Recommendation 9],
                    [Recommendation 10]
                FROM {tableName}
                LIMIT 1 OFFSET $userId;
            ";
            command.Parameters.AddWithValue("$userId", userId - 1); // Adjust offset for userId

            // Execute the query and read the results
            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                for (int i = 0; i < 10; i++)
                {
                    if (!reader.IsDBNull(i))
                    {
                        recommendations.Add(reader.GetString(i));
                    }
                }
            }

            return Ok(recommendations); // Return the list of recommendations
        }

        // GET: api/BrowseRecommendations/{userId}
        // Retrieves collaborative filtering recommendations for a user
        [HttpGet("{userId}")]
        public IActionResult GetRecommendations(int userId)
        {
            var recommendations = new List<string>();

            // Establish a connection to the SQLite database
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                // Query to retrieve collaborative filtering recommendations for the user
                var command = connection.CreateCommand();
                command.CommandText = @"
                    SELECT 
                        [Recommendation 1], [Recommendation 2], [Recommendation 3], 
                        [Recommendation 4], [Recommendation 5], [Recommendation 6], 
                        [Recommendation 7], [Recommendation 8], [Recommendation 9], 
                        [Recommendation 10]
                    FROM collab_browse_rec
                    LIMIT 1 OFFSET @UserOffset;
                ";
                command.Parameters.AddWithValue("@UserOffset", userId - 1); // Adjust offset for userId

                // Execute the query and read the results
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        for (int i = 0; i < 10; i++)
                        {
                            if (!reader.IsDBNull(i))
                            {
                                recommendations.Add(reader.GetString(i));
                            }
                        }
                    }
                    else
                    {
                        // Return 404 if no recommendations are found for the user
                        return NotFound($"No recommendations found for user {userId}");
                    }
                }
            }

            return Ok(recommendations); // Return the list of recommendations
        }
    }
}