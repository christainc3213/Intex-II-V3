import React, { useState, useEffect } from 'react'; // Importing React and hooks for state and lifecycle management.
import { MovieType } from '../types/MovieType'; // Importing the MovieType interface for type safety.
import { handleAddMovie, handleEditMovie, deleteMovie, fetchMovies } from '../api/moviesAPI'; // Importing API functions for movie operations.
import NewMovieForm from '../components/AddMovieForm'; // Component for adding a new movie.
import EditMovieForm from '../components/EditMovieForm'; // Component for editing an existing movie.
import styled from 'styled-components'; // Importing styled-components for styling.
import Pagination from '../components/Pagination'; // Component for pagination controls.
import AdminHeader from './AdminHeader'; // Header component for the admin page.

const AdminPage = () => {
    // State to store the list of movies.
    const [movies, setMovies] = useState<MovieType[]>([]);
    // State to track the current page for pagination.
    const [currentPage, setCurrentPage] = useState(1);
    // State to track the number of movies per page.
    const [pageSize, setPageSize] = useState(10);
    // State to indicate whether data is being loaded.
    const [loading, setLoading] = useState<boolean>(true);
    // State to store the total number of pages.
    const [totalPages, setTotalPages] = useState<number>(0);
    // State to store any error messages.
    const [error, setError] = useState<string | null>(null);
    // State to control the visibility of the add movie form.
    const [showForm, setShowForm] = useState<boolean>(false);
    // State to store the movie being edited.
    const [editingMovie, setEditingMovie] = useState<MovieType | null>(null);
    // State to store the search query for filtering movies.
    const [searchQuery, setSearchQuery] = useState('');

    // Function to load movies from the API.
    const loadMovies = async (size = pageSize, page = currentPage, search = searchQuery) => {
        try {
            setLoading(true); // Set loading state to true.
            const data = await fetchMovies(size, page, search); // Fetch movies from the API.
            setMovies(data.movies || []); // Update the movies state with the fetched data.
            setTotalPages(Math.ceil((data.totalNumMovies || 0) / size)); // Calculate and set the total number of pages.
        } catch (error) {
            setError((error as Error).message); // Set the error message if an error occurs.
            setMovies([]); // Clear the movies state in case of an error.
        } finally {
            setLoading(false); // Set loading state to false.
        }
    };

    // Function to handle page changes in pagination.
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage); // Update the current page state.
        }
    };

    // Function to handle changes in the page size dropdown.
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value); // Parse the selected page size.
        setPageSize(newSize); // Update the page size state.
        setCurrentPage(1); // Reset the current page to 1.
    };

    // Function to handle the deletion of a movie.
    const handleDelete = async (show_id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this movie?'); // Confirm deletion with the user.
        if (!confirmDelete) return;

        try {
            await deleteMovie(show_id); // Call the API to delete the movie.
            setMovies(movies.filter((movie) => movie.show_id !== show_id)); // Remove the deleted movie from the state.
        } catch (error) {
            alert('Failed to delete movie. Please try again.'); // Show an error message if deletion fails.
        }
    };

    // Function to handle the editing of a movie.
    const handleEdit = (movie: MovieType) => {
        setEditingMovie(movie); // Set the movie to be edited in the state.
    };

    // Function to show the add movie form.
    const handleShowAddMovieForm = () => {
        setShowForm(true); // Set the showForm state to true.
    };

    // Function to generate the poster path for a movie.
    const getPosterPath = (title: string): string => {
        return `/Movie Posters/${title
            .replace(/[^\w\s]/g, "") // Remove special characters from the title.
            .trim()}.jpg`; // Trim whitespace and append the .jpg extension.
    };

    // Function to handle changes in the search input field.
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Update the search query state.
        setCurrentPage(1); // Reset the current page to 1.
    };

    // Effect to load movies whenever the page size or current page changes.
    useEffect(() => {
        loadMovies(); // Call the loadMovies function.
    }, [pageSize, currentPage]);

    // Fallback for paginated movies if the movies state is empty.
    const paginatedMovies = movies || [];

    // Render a loading message if data is being loaded.
    if (loading) {
        return <div className="text-center">Loading movies...</div>;
    }
    // Render an error message if an error occurs.
    if (error) {
        return <div className="text-danger text-center">Error: {error}</div>;
    }

    // Main return statement for rendering the admin page.
    return (
        <AdminContainer>
            {/* Render the admin header with props */}
            <AdminHeader
                allMovies={movies}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                loadMovies={loadMovies}
                handleShowAddMovieForm={handleShowAddMovieForm}
                loading={loading}
            />
            {/* Render the add movie form if showForm is true */}
            {showForm && (
                <NewMovieForm
                    onSuccess={() => {
                        setShowForm(false); // Hide the form on success.
                        loadMovies(); // Reload movies.
                    }}
                    onCancel={() => setShowForm(false)} // Hide the form on cancel.
                />
            )}
            {/* Render the edit movie form if editingMovie is not null */}
            {editingMovie && (
                <EditMovieForm
                    movie={editingMovie}
                    onSuccess={() => {
                        setEditingMovie(null); // Clear the editing movie state on success.
                        loadMovies(); // Reload movies.
                    }}
                    onCancel={() => setEditingMovie(null)} // Clear the editing movie state on cancel.
                />
            )}
            <div style={{ padding: '1rem 4rem' }}>
                {/* Controls for page size and current page */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label>
                        Show:
                        <select value={pageSize} onChange={handlePageSizeChange} style={{ marginLeft: '0.5rem' }}>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={-1}>All</option>
                        </select>
                    </label>
                    <div>Page {currentPage} of {totalPages}</div>
                </div>
                {/* Render the list of movies or a fallback message */}
                {movies.length > 0 ? (
                    <GenreRow>
                        <GenreTitle>All Movies</GenreTitle>
                        <ScrollRow>
                            {paginatedMovies.map((movie) => (
                                <MovieCard key={movie.show_id}>
                                    <MoviePoster
                                        src={getPosterPath(movie.title)} // Set the poster path.
                                        alt={movie.title} // Set the alt text.
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg"; // Fallback image on error.
                                        }}
                                    />
                                    <MovieOverlay className="overlay">
                                        <h4>{movie.title}</h4>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => setEditingMovie(movie)} // Set the movie to be edited.
                                                style={{
                                                    backgroundColor: '#facc15',
                                                    color: '#000',
                                                    padding: '0.4rem 0.6rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(movie.show_id)} // Call the delete handler.
                                                style={{
                                                    backgroundColor: '#ef4444',
                                                    color: '#fff',
                                                    padding: '0.4rem 0.6rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </MovieOverlay>
                                </MovieCard>
                            ))}
                        </ScrollRow>
                    </GenreRow>
                ) : (
                    <div>No movies found.</div> // Fallback message if no movies are found.
                )}
            </div>
            <div style={{ padding: '1rem 6rem' }}>
                {/* Render the pagination component */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </AdminContainer>
    );
};

export default AdminPage; // Export the AdminPage component.

// Styled components for styling the admin page.
const AdminContainer = styled.div`
    background-color: #141414;
    color: #fff;
    padding-top: 5rem;
`;

const GenreRow = styled.div`
    margin-top: 3rem;
    padding: 0 1rem;
`;

const GenreTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 1rem;
`;

const ScrollRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.855rem;
`;

const MovieCard = styled.div`
    position: relative;
    min-width: 160px;
    max-width: 160px;
    height: 240px;
    overflow: hidden;
    border-radius: 8px;
    flex-shrink: 0;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }

    &:hover .overlay {
        transform: translateY(0%);
        pointer-events: auto;
    }
`;

const MoviePoster = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const MovieOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 60%);
    color: white;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    transform: translateY(100%);
    transition: transform 0.4s ease;
    pointer-events: none;

    & h4 {
        margin: 0;
        font-size: 1rem;
        text-align: center;
        margin-bottom: 0.5rem;
    }

    & button {
        background: white;
        color: black;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        font-size: 0.85rem;
        transition: background 0.3s;

        &:hover {
            background: #eee;
        }
    }
`;

const IconGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const StyledIcon = styled.div`
    font-size: 24px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    padding: 6px 12px;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    margin-right: 12px;
    background-color: black;
    color: white;
    width: 200px;
`;
