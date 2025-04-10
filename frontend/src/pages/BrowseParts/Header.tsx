import styled from "styled-components"; // Importing styled-components for styling.
import { FiSearch, FiUser } from "react-icons/fi"; // Importing icons for search and user.
import { useNavigate } from "react-router-dom"; // Importing useNavigate for programmatic navigation.
import { MovieType } from "../../types/MovieType"; // Importing the MovieType interface for type safety.
import React, { useState, useEffect, useRef } from "react"; // Importing React and hooks for state, effects, and refs.
import Logout from "../../components/Logout"; // Importing the Logout component for user logout functionality.
import AdminButton from "../../components/AdminButton"; // Importing the AdminButton component for admin access.

export interface HeaderProps {
    selectedGenre: string; // The currently selected genre.
    setSelectedGenre: (genre: string) => void; // Function to update the selected genre.
    genres: string[]; // List of available genres.
    formatGenreName: (genre: string) => string; // Function to format genre names for display.
    allMovies: MovieType[]; // List of all movies.
}

const Header = ({
                    selectedGenre,
                    setSelectedGenre,
                    genres,
                    formatGenreName,
                    allMovies,
                }: HeaderProps) => {
    const navigate = useNavigate(); // Hook for navigation.
    const [searchOpen, setSearchOpen] = useState(false); // State to track whether the search input is open.
    const [searchQuery, setSearchQuery] = useState(""); // State to store the search query.
    const [userMenuOpen, setUserMenuOpen] = useState(false); // State to track whether the user menu is open.
    const [userRole, setUserRole] = useState<string | null>(null); // State to store the user's role.

    const [dropdownOpen, setDropdownOpen] = useState(false); // State to track whether the genre dropdown is open.

    const openDropdown = () => setDropdownOpen(true); // Function to open the genre dropdown.
    const closeDropdown = () => setDropdownOpen(false); // Function to close the genre dropdown.
    const toggleDropdown = () => setDropdownOpen((o) => !o); // Function to toggle the genre dropdown.

    const handleGenreSelect = (genre: string) => {
        setDropdownOpen(false); // Close the dropdown.
        window.location.href = `/browse?genre=${genre}`; // Navigate to the selected genre.
    };

    const userMenuRef = useRef<HTMLDivElement>(null); // Ref for the user menu dropdown.
    const userMenuWrapperRef = useRef<HTMLDivElement>(null); // Ref for the user menu wrapper.

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Fetch user information from the API.
                const response = await fetch("https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/user/info", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    // Check if the user has the "Administrator" role.
                    if (data.roles?.includes("Administrator")) {
                        setUserRole("Administrator");
                    } else {
                        setUserRole("User"); // Optional fallback role.
                    }
                } else {
                    console.error("Failed to fetch user info");
                }
            } catch (err) {
                console.error("Error fetching user info", err);
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

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const genre = e.target.value; // Get the selected genre.
        navigate(`/browse?genre=${genre}`); // Navigate to the selected genre.
    };

    const handleHomeClick = () => {
        window.location.href = "/browse"; // Navigate to the home page.
    };

    const handleMoviesClick = () => {
        window.location.href = "/browse?type=Movies"; // Navigate to the Movies page.
    };

    const handleTVClick = () => {
        window.location.href = "/browse?type=TV-Shows"; // Navigate to the TV Shows page.
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`); // Navigate to the search results page.
            setSearchQuery(""); // Clear the search query.
            setSearchOpen(false); // Close the search input.
        }
    };

    const isGenreSelected = () => {
        return selectedGenre !== "all" && !window.location.search.includes("type="); // Check if a specific genre is selected.
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
                    $active={location.pathname === "/browse" && !location.search.includes("type=") && selectedGenre === "all"}
                    onClick={handleHomeClick}
                >
                    Home
                </NavItem>

                <NavItem
                    $active={location.search.includes("type=Movies")}
                    onClick={handleMoviesClick}
                >
                    Movies
                </NavItem>

                <NavItem
                    $active={location.search.includes("type=TV-Shows")}
                    onClick={handleTVClick}
                >
                    TV Shows
                </NavItem>

                {/* Genre dropdown */}
                <GenreDropdownWrapper onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                    <GenreDisplay $active={isGenreSelected()} onClick={() => setDropdownOpen((prev) => !prev)}>
                        {selectedGenre === "all" ? "All Genres" : formatGenreName(selectedGenre)}
                        <Underline $active={isGenreSelected()} />
                    </GenreDisplay>

                    <DropdownMenu $open={dropdownOpen}>
                        <GenreGrid>
                            {genres.map((genre) => (
                                <DropdownItem key={genre} onClick={() => handleGenreSelect(genre)}>
                                    {formatGenreName(genre)}
                                </DropdownItem>
                            ))}
                        </GenreGrid>
                    </DropdownMenu>
                </GenreDropdownWrapper>
            </NavMenu>

            {/* User menu and search input */}
            <IconWrapper>
                {searchOpen && (
                    <SearchInput
                        $visible={searchOpen}
                        type="text"
                        placeholder="Search titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        autoFocus
                    />
                )}
                <StyledIcon as={FiSearch} onClick={() => setSearchOpen(!searchOpen)} />
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

export default Header; // Exporting the Header component as the default export.

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
  position: relative; // Position relative for child elements.
  color: white; // Text color.
  font-size: 1.125rem; // Font size of the navigation item.
  font-weight: 600; // Font weight of the navigation item.
  cursor: pointer; // Change cursor to pointer on hover.
  padding-bottom: 4px; // Padding below the text.

  &::after {
    content: ""; // Add a decorative underline.
    position: absolute; // Position the underline absolutely.
    bottom: 0; // Position at the bottom of the text.
    left: 0; // Align to the left.
    width: ${({ $active }) => ($active ? "100%" : "0")}; // Adjust width based on active state.
    height: 2px; // Height of the underline.
    background-color: white; // Color of the underline.
    transition: width 0.3s ease; // Smooth transition for width changes.
  }

  &:hover::after {
    width: 100%; // Expand the underline on hover.
  }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    width: 280px; /* Lock width to reserve space */
    flex-shrink: 0;
    position: relative;

    > * {
        flex-shrink: 0;
    }
`;

const LogoWrapper = styled.div`
  width: 340px;
  display: flex;
  align-items: center;
`;

const StyledIcon = styled.div`
    width: 24px;
    height: 24px;
    font-size: 24px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }
`;

const SearchInput = styled.input<{ $visible: boolean }>`
    padding: 6px 12px;
    font-size: 1rem;
    border: 1px solid white;
    border-radius: 4px;
    background-color: black;
    color: white;
    width: ${({ $visible }) => ($visible ? "200px" : "0")};
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    margin-right: ${({ $visible }) => ($visible ? "12px" : "0")};
    transition: all 0.4s ease;
    overflow: hidden;
    white-space: nowrap;
    pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
`;


const UserDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 3px;
  color: white;
  z-index: 999;
  min-width: 120px;

  a.logout,
  a.admin-button {
    color: white;
    text-decoration: none;
    font-weight: 500;
    display: block;
    padding: 6px 10px;
    border-radius: 6px;
    transition: background 0.3s;

    &:hover {
      background: #222;
    }
  }
`;

const GenreDropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const GenreDisplay = styled.div<{ $active?: boolean }>`
  position: relative;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  padding: 4px 0;
  display: inline-flex;
  align-items: center;
`;

const Underline = styled.div<{ $active?: boolean }>`
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  background-color: white;
  width: ${({ $active }) => ($active ? "100%" : "0")};
  transition: width 0.3s ease;
`;

const DropdownMenu = styled.div<{ $open: boolean }>`
position:absolute;
top:100%;
   left:50%;
   transform:translate(-50%, ${({ $open }) => ($open ? "0" : "-8px")});
  opacity:${({ $open }) => ($open ? 1 : 0)};
  transition:opacity .75s ease, transform .25s ease;
  background:#0a0d12;
  border-radius:8px;
   padding:${({ $open }) => ($open ? "1rem" : "0 1rem")};
   width:600px;max-width:90vw;
   box-shadow:0 4px 12px rgba(0,0,0,.5);
   pointer-events:${({ $open }) => ($open ? "auto" : "none")};
   z-index:999;overflow:hidden;
 `;

const DropdownItem = styled.div`
    padding: 0.5rem;
    font-size: 1rem;
    color: white;
    text-align: left;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s ease;

    &:hover {
        background: #222;
    }
`;

const GenreGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* or however many columns you want */
    gap: 0.5rem 2rem;
`;
