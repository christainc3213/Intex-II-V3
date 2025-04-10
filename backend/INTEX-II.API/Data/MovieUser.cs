using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX_II.API.Models
{
    // MovieUser class represents a user in the system
    [Table("movies_users")] // Maps this class to the "movies_users" table in the database
    public class MovieUser
    {
        [Key]
        public int user_id { get; set; } // Unique identifier for the user

        public string name { get; set; } // Name of the user
        public string phone { get; set; } // Phone number of the user
        public string email { get; set; } // Email address of the user
        public int age { get; set; } // Age of the user
        public string gender { get; set; } // Gender of the user

        // Subscription flags (indicate whether the user has a subscription to specific streaming services)
        public int Netflix { get; set; } // Netflix subscription flag
        [Column("Amazon Prime")]
        public int amazon_prime { get; set; } // Amazon Prime subscription flag
        [Column("Disney+")]
        public int disney_plus { get; set; } // Disney+ subscription flag
        [Column("Paramount+")]
        public int paramount_plus { get; set; } // Paramount+ subscription flag
        public int Max { get; set; } // Max (formerly HBO Max) subscription flag
        public int Hulu { get; set; } // Hulu subscription flag
        [Column("Apple TV+")]
        public int apple_tv_plus { get; set; } // Apple TV+ subscription flag
        public int Peacock { get; set; } // Peacock subscription flag

        // Location information
        public string city { get; set; } // City where the user resides
        public string state { get; set; } // State where the user resides
        public int zip { get; set; } // ZIP code of the user's location
    }
}
