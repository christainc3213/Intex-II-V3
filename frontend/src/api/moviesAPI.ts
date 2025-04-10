import { MovieType } from "../types/MovieType"; // Importing the MovieType interface for type safety.

// Interface defining the structure of the response from the fetchMovies API.
interface fetchMoviesResponse {
    json(): unknown; // Method to parse the response as JSON.
    movies: MovieType[]; // Array of movies.
    totalNumMovies: number; // Total number of movies available.
}

// Base URL for the API.
const API_URL =
    "https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/MainDb";

// Function to fetch movies from the API with pagination and optional search term.
export const fetchMovies = async (pageSize = 10, pageNumber = 1, searchTerm = '') => {
    // Construct query parameters for the API request.
    const query = new URLSearchParams({
        pageSize: pageSize.toString(), // Convert pageSize to string.
        pageNumber: pageNumber.toString(), // Convert pageNumber to string.
    });

    // Append the search term to the query if it is not empty.
    if (searchTerm.trim()) {
        query.append('search', searchTerm.trim());
    }

    // Make the API request using the constructed query.
    const response = await fetch(`${API_URL}?${query.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch movies'); // Throw an error if the response is not OK.
    }
    return await response.json(); // Parse and return the JSON response.
};

// Function to add a new movie to the database.
export const handleAddMovie = async (newMovie: MovieType): Promise<MovieType> => {
    try {
        // Make a POST request to the AddMovie endpoint with the new movie data.
        const response = await fetch(`${API_URL}/AddMovie`, {
            method: 'POST', // HTTP method for creating a resource.
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON.
            },
            body: JSON.stringify(newMovie), // Convert the new movie object to a JSON string.
        });

        if (!response.ok) {
            throw new Error(`Error adding movie: ${response.statusText}`); // Throw an error if the response is not OK.
        }

        const savedMovie: MovieType = await response.json(); // Parse the response as a MovieType object.
        return savedMovie; // Return the saved movie.
    } catch (error) {
        console.error("Error adding movie:", error); // Log the error to the console.
        throw error; // Re-throw the error for further handling.
    }
};

// Function to edit an existing movie in the database.
export const handleEditMovie = async (show_id: string, updatedMovie: MovieType): Promise<MovieType> => {
    try {
        // Make a PUT request to the UpdateMovie endpoint with the updated movie data.
        const response = await fetch(`${API_URL}/UpdateMovie/${show_id}`, {
            method: 'PUT', // HTTP method for updating a resource.
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON.
            },
            body: JSON.stringify(updatedMovie), // Convert the updated movie object to a JSON string.
        });

        if (!response.ok) {
            throw new Error(`Error updating book: ${response.statusText}`); // Throw an error if the response is not OK.
        }

        return await response.json(); // Parse and return the JSON response.
    } catch (error) {
        console.error(`Error updating Book:`, error); // Log the error to the console.
        throw error; // Re-throw the error for further handling.
    }
};

// Function to delete a movie from the database.
export const deleteMovie = async (show_id?: string): Promise<void> => {
    try {
        // Make a DELETE request to the DeleteMovie endpoint with the movie ID.
        const response = await fetch(`${API_URL}/DeleteMovie/${show_id}`, {
            method: 'DELETE', // HTTP method for deleting a resource.
        });

        if (!response.ok) {
            throw new Error('Failed to delete movie'); // Throw an error if the response is not OK.
        }
    } catch (error) {
        console.error('Error deleting movie:', error); // Log the error to the console.
        throw error; // Re-throw the error for further handling.
    }
};