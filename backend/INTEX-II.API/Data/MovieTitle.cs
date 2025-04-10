using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX_II.API.Models
{
    // MovieTitle class represents a movie or TV show entry in the database
    [Table("movies_titles")] // Maps this class to the "movies_titles" table in the database
    public class MovieTitle
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string show_id { get; set; } // Unique identifier for the movie or TV show

        public string? type { get; set; } // Type of content (e.g., "Movie", "TV Show")
        public string? title { get; set; } // Title of the movie or TV show
        public string? director { get; set; } // Director of the movie or TV show
        public string? cast { get; set; } // Cast members of the movie or TV show
        public string? country { get; set; } // Country of origin
        public int release_year { get; set; } // Release year of the movie or TV show
        public string? rating { get; set; } // Content rating (e.g., "PG-13", "R")
        public string? duration { get; set; } // Duration of the movie or TV show
        public string? description { get; set; } // Description or synopsis of the movie or TV show

        // Genre flags (indicate whether the movie/TV show belongs to specific genres)
        public int? Action { get; set; } // Action genre flag
        public int Adventure { get; set; } // Adventure genre flag
        [Column("Anime Series International TV Shows")]
        public int anime_int_tv { get; set; } // Anime and international TV shows genre flag
        [Column("British TV Shows Docuseries International TV Shows")]
        public int british_int_tv { get; set; } // British and international TV shows genre flag
        public int? Children { get; set; } // Children genre flag
        public int Comedies { get; set; } // Comedy genre flag
        [Column("Comedies Dramas International Movies")]
        public int comedy_drama_int { get; set; } // Comedy, drama, and international movies genre flag
        [Column("Comedies International Movies")]
        public int comedy_int { get; set; } // Comedy and international movies genre flag
        [Column("Comedies Romantic Movies")]
        public int comedy_romance { get; set; } // Comedy and romantic movies genre flag
        [Column("Crime TV Shows Docuseries")]
        public int crime_tv { get; set; } // Crime TV shows and docuseries genre flag
        public int Documentaries { get; set; } // Documentaries genre flag
        [Column("Documentaries International Movies")]
        public int documentary_int { get; set; } // Documentaries and international movies genre flag
        public int Docuseries { get; set; } // Docuseries genre flag
        public int Dramas { get; set; } // Drama genre flag
        [Column("Dramas International Movies")]
        public int drama_int { get; set; } // Drama and international movies genre flag
        [Column("Dramas Romantic Movies")]
        public int drama_romance { get; set; } // Drama and romantic movies genre flag
        [Column("Family Movies")]
        public int family { get; set; } // Family movies genre flag
        public int fantasy { get; set; } // Fantasy genre flag
        [Column("Horror Movies")]
        public int? horror { get; set; } // Horror movies genre flag
        [Column("International Movies Thrillers")]
        public int thriller_int { get; set; } // International movies and thrillers genre flag
        [Column("International TV Shows Romantic TV Shows TV Dramas")]
        public int drama_romance_int_tv { get; set; } // International TV shows, romantic TV shows, and TV dramas genre flag
        [Column("Kids' TV")]
        public int kids_tv { get; set; } // Kids' TV genre flag
        [Column("Language TV Shows")]
        public int language_tv { get; set; } // Language TV shows genre flag
        public int Musicals { get; set; } // Musicals genre flag
        [Column("Nature TV")]
        public int nature_tv { get; set; } // Nature TV genre flag
        [Column("Reality TV")]
        public int reality_tv { get; set; } // Reality TV genre flag
        public int Spirituality { get; set; } // Spirituality genre flag
        [Column("TV Action")]
        public int action_tv { get; set; } // TV action genre flag
        [Column("TV Comedies")]
        public int comedy_tv { get; set; } // TV comedies genre flag
        [Column("TV Dramas")]
        public int drama_tv { get; set; } // TV dramas genre flag
        [Column("Talk Shows TV Comedies")]
        public int talk_show_comedy_tv { get; set; } // Talk shows and TV comedies genre flag
        public int Thrillers { get; set; } // Thrillers genre flag
    }
}
