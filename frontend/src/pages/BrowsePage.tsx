import { useState, useEffect } from "react"; // Importing React hooks for state and lifecycle management.
import styled from "styled-components"; // Importing styled-components for styling.
import { useNavigate } from "react-router-dom"; // Importing navigation hook for routing.
import { MovieType } from "../types/MovieType"; // Importing the MovieType interface for type safety.
import Header from "./BrowseParts/Header"; // Header component for the browse page.
import FeaturedCarousel from "./BrowseParts/FeaturedCarousel"; // Component for displaying featured movies in a carousel.
import GenreRows from "./BrowseParts/GenreRows"; // Component for displaying movies grouped by genre.
import Spinner from "../components/Spinner"; // Spinner component for loading state.
import { useLocation } from "react-router-dom"; // Hook for accessing the current location.
import { useMemo } from "react"; // Hook for memoizing computed values.

const BrowsePage = () => {
    // State to store the list of movies.
    const [movies, setMovies] = useState<MovieType[]>([]);
    // State to store the list of genres.
    const [genres, setGenres] = useState<string[]>([]);
    // State to indicate whether data is being loaded.
    const [loading, setLoading] = useState(true);
    // State to track the selected genre.
    const [selectedGenre, setSelectedGenre] = useState("all");
    // State to track the current slide in the featured carousel.
    const [currentSlide, setCurrentSlide] = useState(0);
    // State to track the selected content type (all, Movie, or TV Show).
    const [contentType, setContentType] = useState<"all" | "Movie" | "TV Show">("all");
    // Hook for navigation.
    const navigate = useNavigate();
    // Hook for accessing the current location.
    const location = useLocation();
    // State to store recommended movies.
    const [recommendedMovies, setRecommendedMovies] = useState<MovieType[]>([]);
    // States to store genre-specific recommendations.
    const [actionRecommendations, setActionRecommendations] = useState<MovieType[]>([]);
    const [comedyRecommendations, setComedyRecommendations] = useState<MovieType[]>([]);
    const [dramaRecommendations, setDramaRecommendations] = useState<MovieType[]>([]);

    // Effect to fetch recommendations for the user.
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const userId = 11; // Hardcoded user ID for fetching recommendations.
                const response = await fetch(`https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/api/BrowseRecommendations/${userId}`);
                const titles: string[] = await response.json();

                // Match recommended titles with the movies list.
                const matches = movies.filter((movie) =>
                    titles.some((title) => title.trim().toLowerCase() === movie.title.trim().toLowerCase())
                );

                setRecommendedMovies(matches); // Update the recommended movies state.
            } catch (error) {
                console.error("❌ Failed to fetch recommended titles", error); // Log any errors.
            }
        };

        // Function to fetch genre-specific recommendations.
        const fetchGenreRecs = async (genre: string, setter: (movies: MovieType[]) => void) => {
            try {
                const userId = 11; // Hardcoded user ID for fetching recommendations.
                const res = await fetch(`https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/api/BrowseRecommendations/genre/${genre}/${userId}`);
                const titles: string[] = await res.json();

                // Match recommended titles with the movies list.
                const matches = movies.filter((movie) =>
                    titles.some((title) => title.trim().toLowerCase() === movie.title.trim().toLowerCase())
                );
                setter(matches); // Update the genre-specific recommendations state.
            } catch (err) {
                console.error(`❌ Failed to fetch ${genre} recommendations`, err); // Log any errors.
            }
        };

        if (!loading) {
            fetchRecommendations(); // Fetch general recommendations.
            fetchGenreRecs("action", setActionRecommendations); // Fetch action recommendations.
            fetchGenreRecs("comedies", setComedyRecommendations); // Fetch comedy recommendations.
            fetchGenreRecs("dramas", setDramaRecommendations); // Fetch drama recommendations.
        }
    }, [movies, loading]);

    // Effect to handle URL parameters for genre and content type.
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const genreFromUrl = params.get("genre");
        const typeFromUrl = params.get("type");

        if (genreFromUrl) {
            setSelectedGenre(genreFromUrl); // Update the selected genre from the URL.
        } else {
            setSelectedGenre("all"); // Default to "all" if no genre is specified.
        }

        if (typeFromUrl === "Movies") {
            setContentType("Movie"); // Set content type to "Movie".
        } else if (typeFromUrl === "TV-Shows") {
            setContentType("TV Show"); // Set content type to "TV Show".
        } else {
            setContentType("all"); // Default to "all" if no type is specified.
        }
    }, [location.search]);

    // Effect to handle scroll events (currently logs scroll data).
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const viewportHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            const nearBottom = scrollTop + viewportHeight >= fullHeight - 300; // Check if near the bottom of the page.

            console.log("🧮 scrollY:", window.scrollY);
            console.log("📏 viewport height:", window.innerHeight);
            console.log("📐 full page height:", document.documentElement.scrollHeight);
        };

        window.addEventListener("scroll", handleScroll); // Add scroll event listener.
        return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount.
    }, [selectedGenre]);

    // Effect to fetch movie data from the API.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/movietitles");
                const rawData = await response.json();

                // List of genre keys to extract genres from the data.
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

                // Function to create a slug from a string.
                const slugify = (text: string): string =>
                    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

                // Transform the raw data into a structured format.
                const transformed = rawData.map((item: any) => {
                    const genre = extractFirstGenre(item);
                    return {
                        show_id: item.show_id,
                        type: item.type,
                        title: item.title,
                        description: item.description || "No description available",
                        genre,
                        slug: slugify(item.title),
                        docId: item.show_id,
                        posterFile: `/Movie Posters/${item.title.replace(/[\W_]+/g, " ").trim()}.jpg`
                    };
                });

                // Extract unique genres from the transformed data.
                const uniqueGenres: string[] = Array.from(new Set((transformed as MovieType[]).map((m: MovieType) => m.genre))).sort();

                setMovies(transformed); // Update the movies state.
                setGenres(uniqueGenres); // Update the genres state.
                setLoading(false); // Set loading state to false.
            } catch (error) {
                console.error("❌ Failed to fetch movie data", error); // Log any errors.
            }
        };

        fetchData(); // Fetch the data.
    }, []);

    // Memoized filtered movies based on content type.
    const filteredByType = useMemo(() => {
        return contentType === "all"
            ? movies
            : movies.filter((m) => m.type.toLowerCase() === contentType.toLowerCase());
    }, [movies, contentType]);

    // Memoized filtered movies based on selected genre.
    const filteredMovies = useMemo(() => {
        return selectedGenre === "all"
            ? filteredByType
            : filteredByType.filter((m) => m.genre === selectedGenre);
    }, [filteredByType, selectedGenre]);

    // Render a spinner if data is still loading.
    if (loading) return <Spinner size={60} color="#ffffff" centered />;

    // Determine the first featured movie ID based on selected genre and content type.
    let firstFeaturedId: string | null = null;

    if (selectedGenre === "all" && contentType === "all") {
        firstFeaturedId = "s341"; // Home page.
    } else if (contentType === "Movie") {
        firstFeaturedId = "s330"; // Example for Movies page.
    } else if (contentType === "TV Show") {
        firstFeaturedId = "s6"; // Example for TV Shows page.
    } else if (selectedGenre === "action") {
        firstFeaturedId = "s609"; // Example for Action genre.
    } else if (selectedGenre === "comedies") {
        firstFeaturedId = "s28"; // Example for Comedies.
    } else if (selectedGenre === "dramas") {
        firstFeaturedId = "s829"; // Example for Dramas.
    }

    // Create the featured movies list.
    const featuredMovies = firstFeaturedId
        ? [
            ...filteredMovies.filter((m) => m.docId === firstFeaturedId),
            ...filteredMovies.filter((m) => m.docId !== firstFeaturedId).slice(0, 4),
        ]
        : filteredMovies.slice(4, 9);

    // Group movies by genre.
    const moviesByGenre: Record<string, MovieType[]> = {};
    filteredMovies.forEach((movie) => {
        if (!moviesByGenre[movie.genre]) moviesByGenre[movie.genre] = [];
        moviesByGenre[movie.genre].push(movie);
    });

    // Function to format genre names for display.
    const formatGenreName = (key: string): string =>
        key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\bTv\b/i, "TV");

    // Function to generate the poster path for a movie.
    const getPosterPath = (title: string): string => {
        return `/Movie Posters/${title.replace(/[^\w\s]/g, "").trim()}.jpg`;
    };

    // Render the browse page.
    return (
        <>
            {/* Render the header component */}
            <Header
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                allMovies={movies}
                genres={genres}
                formatGenreName={formatGenreName}
            />

            {/* Render the featured carousel */}
            <FeaturedCarousel
                movies={filteredMovies}
                selectedGenre={selectedGenre}
                featuredMovies={featuredMovies}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                getPosterPath={getPosterPath}
            />

            {/* Render the genre rows */}
            <GenreRows
                moviesByGenre={moviesByGenre}
                selectedGenre={selectedGenre}
                recommendedMovies={recommendedMovies}
                formatGenreName={formatGenreName}
                getPosterPath={getPosterPath}
                filteredMovies={filteredMovies}
                actionRecs={actionRecommendations}
                comedyRecs={comedyRecommendations}
                dramaRecs={dramaRecommendations}
            />
        </>
    );
};

export default BrowsePage; // Export the BrowsePage component.