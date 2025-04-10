using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX_II.API.Models
{
    // MovieRating class represents a user's rating for a specific movie
    [Table("movies_ratings")] // Maps this class to the "movies_ratings" table in the database
    public class MovieRating
    {
        public int user_id { get; set; } // ID of the user who rated the movie
        public string show_id { get; set; } // ID of the movie being rated
        public int rating { get; set; } // Rating value given by the user (e.g., 1-5 stars)
    }
}
