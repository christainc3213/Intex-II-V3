import styled from "styled-components"; // Importing styled-components for styling.
import { useLayoutEffect, useEffect, useRef, useState } from "react"; // Importing hooks for state, effects, and layout effects.
import MovieScrollRow from "../../components/MovieScrollRow"; // Component for rendering a horizontal scrollable row of movies.
import { MovieType } from "../../types/MovieType"; // Importing the MovieType interface for type safety.
import PosterCard from "../../components/PosterCard"; // Component for rendering individual movie posters.

export interface GenreRowsProps {
    moviesByGenre: Record<string, MovieType[]>; // Object mapping genres to arrays of movies.
    selectedGenre: string; // The currently selected genre.
    recommendedMovies: MovieType[]; // List of recommended movies.
    formatGenreName: (g: string) => string; // Function to format genre names for display.
    getPosterPath: (t: string) => string; // Function to generate the poster path for a movie.
    filteredMovies: MovieType[]; // List of movies filtered by the selected genre.
    actionRecs: MovieType[]; // List of recommended action movies.
    comedyRecs: MovieType[]; // List of recommended comedy movies.
    dramaRecs: MovieType[]; // List of recommended drama movies.
}

const ROW_BATCH = 2; // Number of new rows to load each time the sentinel is intersected.
const MOVIE_BATCH = 20; // Number of new movie posters to load each time the sentinel is intersected.

export default function GenreRows(props: GenreRowsProps) {
    const {
        moviesByGenre,
        selectedGenre,
        recommendedMovies,
        formatGenreName,
        getPosterPath,
        filteredMovies,
        actionRecs,
        comedyRecs,
        dramaRecs,
    } = props;

    /* --------- state that drives the UI ---------- */
    const [visibleRowCount, setVisibleRowCount] = useState(3); // State to track the number of visible rows.
    const [visibleMovieCount, setVisibleMovieCount] = useState(30); // State to track the number of visible movie posters.

    /* --------- sentinels (invisible divs) -------- */
    const rowSentinelRef = useRef<HTMLDivElement | null>(null); // Ref for the row sentinel.
    const movieSentinelRef = useRef<HTMLDivElement | null>(null); // Ref for the movie sentinel.

    /* ---------- observe the bottom‑of‑rows ---------- */
    useEffect(() => {
        if (!rowSentinelRef.current) return;

        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleRowCount(prev => prev + ROW_BATCH); // Increase the visible row count when the sentinel is intersected.
            }
        });
        io.observe(rowSentinelRef.current); // Observe the row sentinel.
        return () => io.disconnect(); // Disconnect the observer on cleanup.
    }, []);

    /* ---------- observe the bottom‑of‑movies -------- */
    useEffect(() => {
        if (!movieSentinelRef.current) return;

        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleMovieCount(prev => prev + MOVIE_BATCH); // Increase the visible movie count when the sentinel is intersected.
            }
        });
        io.observe(movieSentinelRef.current); // Observe the movie sentinel.
        return () => io.disconnect(); // Disconnect the observer on cleanup.
    }, []);

    /* ---------- scroll to top on mount ---------- */
    useLayoutEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts.
    }, []);

    /* --------------- render ----------------- */
    return (
        <PageBackground>
            {/* Render recommended movies if no specific genre is selected */}
            {selectedGenre === "all" && (
                <MovieScrollRow
                    title="Recommended For You"
                    movies={recommendedMovies}
                    getPosterPath={getPosterPath}
                />
            )}

            {/* Render rows of movies by genre */}
            {selectedGenre === "all" ? (
                <>
                    {Object.entries(moviesByGenre)
                        .slice(0, visibleRowCount) // Limit the number of rows based on visibleRowCount.
                        .map(([g, list]) => (
                            <MovieScrollRow
                                key={g}
                                title={formatGenreName(g)} // Format the genre name for display.
                                movies={list} // Pass the list of movies for the genre.
                                getPosterPath={getPosterPath}
                            />
                        ))}
                    {/* Sentinel for loading more rows */}
                    <Sentinel ref={rowSentinelRef} />
                </>
            ) : (
                <>
                    {/* Render recommended movies for specific genres */}
                    {["action", "comedies", "dramas"].includes(selectedGenre) && (
                        <MovieScrollRow
                            title={`Recommended ${formatGenreName(selectedGenre)} For You`}
                            movies={
                                selectedGenre === "action"
                                    ? actionRecs
                                    : selectedGenre === "comedies"
                                    ? comedyRecs
                                    : dramaRecs
                            }
                            getPosterPath={getPosterPath}
                        />
                    )}

                    {/* Render a grid of movies for the selected genre */}
                    <GenreRow>
                        <GenreTitle>{`All ${formatGenreName(selectedGenre)}`}</GenreTitle>
                        <Grid>
                            {filteredMovies.slice(0, visibleMovieCount).map(movie => (
                                <PosterCard
                                    key={movie.docId} // Unique key for each movie.
                                    movie={movie} // Pass the movie data.
                                    posterSrc={getPosterPath(movie.title)} // Generate the poster path.
                                />
                            ))}
                        </Grid>
                        {/* Sentinel for loading more movie posters */}
                        <Sentinel ref={movieSentinelRef} />
                    </GenreRow>
                </>
            )}
        </PageBackground>
    );
}

/* ---------- styled ---------- */

const PageBackground = styled.div`
    background: #121212; // Background color.
    padding: 2rem 1rem 4rem; // Padding around the content.
    margin-top: -80px; // Negative margin to adjust positioning.
`;

const GenreRow = styled.div`
    margin-top: 3rem; // Margin above the genre row.
`;

const GenreTitle = styled.h3`
    color: #fff; // Text color.
    margin-bottom: 1rem; // Margin below the title.
`;

const Grid = styled.div`
    display: grid; // Use grid layout.
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); // Responsive grid columns.
    gap: 0.5rem; // Spacing between grid items.
`;

const Poster = styled.img`
    width: 100%; // Full width of the container.
    height: 240px; // Fixed height.
    object-fit: cover; // Maintain aspect ratio and cover the container.
    border-radius: 8px; // Rounded corners.
`;

const Sentinel = styled.div`
    width: 100%; // Full width of the container.
    height: 1px; // Minimal height for the sentinel.
`;

const PosterImg = styled.img`
    width: 100%; // Full width of the container.
    height: 240px; // Fixed height.
    object-fit: cover; // Maintain aspect ratio and cover the container.
    display: block; // Block-level element.
`;

const Info = styled.div`
    position: absolute; // Position absolutely within the container.
    inset: 0; // Stretch to fill the container.
    background: rgba(0, 0, 0, 0.75); // Semi-transparent black background.
    color: #fff; // Text color.
    opacity: 0; // Initial opacity.
    display: flex; // Use flexbox for layout.
    flex-direction: column; // Stack items vertically.
    justify-content: flex-end; // Align items to the bottom.
    padding: 1rem; // Padding inside the container.
    transition: opacity 0.25s ease; // Smooth transition for opacity changes.

    h4 {
        margin: 0 0 0.25rem 0; // Margin around the heading.
        font-size: 1rem; // Font size for the heading.
    }

    p {
        margin: 0; // Remove margin.
        font-size: 0.85rem; // Font size for the paragraph.
        line-height: 1.2; // Line height for better readability.
    }
`;
