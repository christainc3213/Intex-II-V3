import styled from "styled-components"; // Importing styled-components for styling.
import { FiSearch, FiUser } from "react-icons/fi"; // Importing icons for search and user.
import { useNavigate } from "react-router-dom"; // Importing useNavigate for programmatic navigation.
import { MovieType } from "../types/MovieType"; // Importing the MovieType interface for type safety.
import React, { useState, useEffect, useRef } from "react"; // Importing React and hooks for state, effects, and refs.
import Logout from "../components/Logout"; // Importing the Logout component for user logout functionality.
import AdminButton from "../components/AdminButton"; // Importing the AdminButton component for admin access.

export interface HeaderProps {
    selectedGenre: string; // The currently selected genre.
    setSelectedGenre: (genre: string) => void; // Function to update the selected genre.
    genres: string[]; // List of available genres.
    formatGenreName: (genre: string) => string; // Function to format genre names for display.
    allMovies: MovieType[]; // List of all movies.
}

// Functional component for the movie page header.
const MovieHeader = ({
                    selectedGenre,
                    setSelectedGenre,
                    genres,
                    formatGenreName,
                    allMovies,
                }: HeaderProps) => {
    const navigate = useNavigate(); // Hook for navigation.
    const [userMenuOpen, setUserMenuOpen] = useState(false); // State to track whether the user menu is open.
    const [userRole, setUserRole] = useState<string | null>(null); // State to store the user's role.

    const userMenuRef = useRef<HTMLDivElement>(null); // Ref for the user menu dropdown.
    const userMenuWrapperRef = useRef<HTMLDivElement>(null); // Ref for the user menu wrapper.

    // Effect to fetch user information and handle clicks outside the user menu.
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Fetch user information from the API.
                const response = await fetch("https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/user/info", {
                    method: "GET", // HTTP GET method.
                    credentials: "include", // Include cookies in the request.
                    headers: {
                        "Content-Type": "application/json", // Set content type to JSON.
                    },
                });

                if (response.ok) {
                    const data = await response.json(); // Parse the response JSON.

                    // Check if the user has the "Administrator" role.
                    if (data.roles?.includes("Administrator")) {
                        setUserRole("Administrator"); // Set the user role to "Administrator".
                    } else {
                        setUserRole("User"); // Set the user role to "User" as a fallback.
                    }
                } else {
                    console.error("Failed to fetch user info"); // Log an error if the request fails.
                }
            } catch (err) {
                console.error("Error fetching user info", err); // Log any errors during the fetch.
            }
        };

        fetchUserInfo(); // Call the function to fetch user information.

        // Function to handle clicks outside the user menu.
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuWrapperRef.current &&
                !userMenuWrapperRef.current.contains(event.target as Node)
            ) {
                setUserMenuOpen(false); // Close the user menu if the click is outside.
            }
        };

        document.addEventListener("mousedown", handleClickOutside); // Add event listener for clicks outside.
        return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup the event listener on unmount.
    }, []);

    // Function to handle clicks on the home button.
    const handleHomeClick = () => {
        navigate("/browse"); // Navigate to the browse page.
        setTimeout(() => setSelectedGenre("all"), 0); // Reset the selected genre to "all".
    };

    return (
        <StyledHeader>
            {/* Logo section */}
            <LogoWrapper>
                <Logo src="/whitelogo.png" alt="CineNiche" onClick={handleHomeClick} />
            </LogoWrapper>

            {/* Navigation menu */}
            <NavMenu>
                <NavItem
                    $active={
                        location.pathname === "/browse" &&
                        !location.search.includes("type=") &&
                        selectedGenre === "all"
                    }
                    onClick={handleHomeClick}
                >
                    Home
                </NavItem>

                <NavItem
                    $active={location.search.includes("type=Movies")}
                    onClick={() => navigate("/browse?type=Movies")}
                >
                    Movies
                </NavItem>

                <NavItem
                    $active={location.search.includes("type=TV-Shows")}
                    onClick={() => navigate("/browse?type=TV-Shows")}
                >
                    TV Shows
                </NavItem>
            </NavMenu>

            {/* User menu and icons */}
            <IconWrapper>
                <StyledIcon as={FiUser} onClick={() => setUserMenuOpen(!userMenuOpen)} />

                {userMenuOpen && (
                    <UserDropdown ref={userMenuRef}>
                        <Logout>Logout</Logout> {/* Logout option */}
                        {userRole === "Administrator" && <AdminButton>Admin</AdminButton>} {/* Admin button if the user is an admin */}
                    </UserDropdown>
                )}
            </IconWrapper>
        </StyledHeader>
    );
};

export default MovieHeader; // Exporting the MovieHeader component as the default export.

// Styled Components

const StyledHeader = styled.header`
  position: fixed; // Fix the header at the top of the page.
  top: 0;
  left: 0;
  right: 0;
  height: 70px; // Height of the header.
  z-index: 100; // Set the stacking order.
  display: flex; // Use flexbox for layout.
  align-items: center; // Center-align items vertically.
  justify-content: space-between; // Space out items horizontally.
  padding: 0 24px; // Horizontal padding.
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), transparent); // Gradient background.
`;

const Logo = styled.img`
  height: 60px; // Height of the logo.
  object-fit: contain; // Maintain aspect ratio of the logo.
  cursor: pointer; // Change cursor to pointer on hover.
`;

const NavMenu = styled.nav`
  display: flex; // Use flexbox for layout.
  align-items: center; // Center-align items vertically.
  gap: 24px; // Add spacing between navigation items.
`;

const NavItem = styled.div<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? "white" : "gray")}; // Change color based on active state.
  font-size: 1.125rem; // Font size of the navigation item.
  font-weight: 600; // Font weight of the navigation item.
  cursor: pointer; // Change cursor to pointer on hover.
  transition: color 0.2s; // Smooth transition for color changes.
`;

const GenreSelect = styled.select<{ $active?: boolean }>`
  background: transparent; // Transparent background.
  border: none; // Remove border.
  color: ${({ $active }) => ($active ? "white" : "gray")}; // Change color based on active state.
  font-size: 1.125rem; // Font size of the select element.
  font-weight: 600; // Font weight of the select element.
  appearance: none; // Remove default browser styling.
  cursor: pointer; // Change cursor to pointer on hover.
  padding: 4px 8px; // Padding inside the select element.

  option {
    background: #000; // Background color of the options.
    color: white; // Text color of the options.
  }
`;

const IconWrapper = styled.div`
  display: flex; // Use flexbox for layout.
  align-items: center; // Center-align items vertically.
  gap: 16px; // Add spacing between icons.
  width: 250px; // Width of the icon wrapper.
  justify-content: flex-end; // Align icons to the right.
`;

const LogoWrapper = styled.div`
  width: 340px; // Width of the logo wrapper.
  display: flex; // Use flexbox for layout.
  align-items: center; // Center-align items vertically.
`;

const StyledIcon = styled.div`
  font-size: 24px; // Font size of the icon.
  color: white; // Icon color.
  cursor: pointer; // Change cursor to pointer on hover.
  display: flex; // Use flexbox for layout.
  align-items: center; // Center-align items vertically.
`;

const SearchInput = styled.input`
  padding: 6px 12px; // Padding inside the input field.
  font-size: 1rem; // Font size of the input text.
  border: 1px solid white; // Border color.
  border-radius: 4px; // Rounded corners.
  margin-right: 12px; // Margin to the right of the input field.
  background-color: black; // Background color of the input field.
  color: white; // Text color.
  width: 200px; // Width of the input field.
`;

const UserDropdown = styled.div`
  position: absolute; // Position the dropdown absolutely.
  top: 50px; // Position the dropdown below the header.
  right: 24px; // Align the dropdown to the right.
  background: rgba(0, 0, 0, 0.75); // Semi-transparent background.
  border-radius: 3px; // Rounded corners.
  color: white; // Text color.
  z-index: 999; // Set the stacking order.
  min-width: 120px; // Minimum width of the dropdown.

  a.logout,
  a.admin-button {
    color: white; // Text color of the links.
    text-decoration: none; // Remove underline from links.
    font-weight: 500; // Font weight of the links.
    display: block; // Display links as block elements.
    padding: 6px 10px; // Padding inside the links.
    border-radius: 6px; // Rounded corners for the links.
    transition: background 0.3s; // Smooth transition for background changes.

    &:hover {
      background: #222; // Change background color on hover.
    }
  }
`;
