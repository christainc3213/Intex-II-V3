import { useLocation, useNavigate } from "react-router-dom"; // Importing hooks for navigation and accessing the current location.
import { useEffect, useState } from "react"; // Importing hooks for managing state and side effects.
import styled from "styled-components"; // Importing styled-components for styling.
import { MovieType } from "../types/MovieType"; // Importing the MovieType interface for type safety.
import Header from "../pages/BrowseParts/Header"; // Importing the Header component for the page header.

const SearchResults = () => {
    const location = useLocation(); // Hook to access the current location.
    const navigate = useNavigate(); // Hook for programmatic navigation.
    const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || ""; // Extracting the search query from the URL.

    const [results, setResults] = useState<MovieType[]>([]); // State to store the search results.
    const [selectedGenre, setSelectedGenre] = useState("all"); // State to track the selected genre.
    const [genres, setGenres] = useState<string[]>([]); // State to store the list of genres.

    // Effect to fetch movie data and filter results based on the search query.
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching movie data from the API.
                const res = await fetch("https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/MovieTitles");
                const rawData = await res.json();

                // List of genre keys to identify genres in the data.
                const genreKeys = [
                    "action", "adventure", "anime_int_tv", "british_int_tv", "children", "comedies",
                    "comedy_drama_int", "comedy_int", "comedy_romance", "crime_tv", "documentaries",
                    "documentary_int", "docuseries", "dramas", "drama_int", "drama_romance", "family",
                    "fantasy", "horror", "thriller_int", "drama_romance_int_tv", "kids_tv", "language_tv",
                    "musicals", "nature_tv", "reality_tv", "spirituality", "action_tv", "comedy_tv",
                    "drama_tv", "talk_show_comedy_tv", "thrillers"
                ];

                // Function to extract the first genre from the data.
                const extractFirstGenre = (item: any): string => {
                    for (const key of genreKeys) {
                        if (item[key] === 1) return key;
                    }
                    return "Other"; // Default to "Other" if no genre is found.
                };

                // Function to format genre names for display.
                const formatGenreName = (key: string): string =>
                    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\bTv\b/i, "TV");

                // Transforming the raw data into a structured format.
                const transformed: MovieType[] = rawData.map((item: any) => {
                    const genre = extractFirstGenre(item);
                    return {
                        ...item,
                        genre, // Adding the extracted genre.
                        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), // Generating a slug for the movie.
                        docId: item.show_id, // Adding the document ID.
                        posterFile: `/Movie Posters/${item.title.replace(/[\W_]+/g, " ").trim()}.jpg`, // Generating the poster file path.
                    };
                });

                // Filtering the transformed data based on the search query.
                const filtered = transformed.filter((movie) =>
                    movie.title.toLowerCase().includes(query)
                );

                // Extracting unique genres from the transformed data.
                const uniqueGenres = Array.from(new Set(transformed.map((m) => m.genre))).sort();

                setResults(filtered); // Updating the results state with the filtered data.
                setGenres(uniqueGenres); // Updating the genres state with the unique genres.
            } catch (error) {
                console.error("Error fetching search results:", error); // Logging any errors during the fetch.
            }
        };

        fetchData(); // Calling the fetchData function.
    }, [query]); // Re-run the effect whenever the query changes.

    // Function to format genre names for display.
    const formatGenreName = (key: string): string =>
        key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\bTv\b/i, "TV");

    return (
        <>
            {/* Render the header component */}
            <Header
                selectedGenre={selectedGenre} // Pass the selected genre state.
                setSelectedGenre={setSelectedGenre} // Pass the function to update the selected genre.
                allMovies={results} // Pass the search results.
                genres={genres} // Pass the list of genres.
                formatGenreName={formatGenreName} // Pass the function to format genre names.
            />
            <ResultsPage>
                {/* Display the search query */}
                <h2>Search Results for “{query}”</h2>
                <PosterGrid>
                    {/* Render the search results as a grid of posters */}
                    {results.map((movie) => (
                        <PosterCard key={movie.docId} onClick={() => navigate(`/movie/${movie.slug}`)}>
                            <img
                                src={movie.posterFile} // Set the poster image source.
                                alt={movie.title} // Set the alt text for the image.
                                loading="lazy" // Enable lazy loading for the image.
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg"; // Fallback image on error.
                                }}
                            />
                        </PosterCard>
                    ))}
                </PosterGrid>
            </ResultsPage>
        </>
    );
};

export default SearchResults; // Exporting the SearchResults component as the default export.

// --- Styles ---
const ResultsPage = styled.div`
  background-color: #121212; // Background color of the results page.
  padding: 2rem; // Padding around the content.
  color: white; // Text color.
  padding-top: 100px; // Offset for the fixed header.
`;

const PosterGrid = styled.div`
  display: flex; // Use flexbox for layout.
  flex-wrap: wrap; // Allow items to wrap to the next line.
  gap: 1rem; // Add spacing between items.
`;

const PosterCard = styled.div`
  cursor: pointer; // Change cursor to pointer on hover.
  width: 160px; // Width of each poster card.

  img {
    width: 100%; // Full width of the container.
    height: auto; // Maintain aspect ratio.
    border-radius: 8px; // Rounded corners for the image.
  }
`;
