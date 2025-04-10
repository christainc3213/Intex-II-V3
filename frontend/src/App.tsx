import React, { useEffect } from "react"; // Importing React and useEffect for side effects.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importing React Router components for routing.
import HomePage from "./pages/HomePage"; // Importing the HomePage component.
import LoginPage from "./pages/LoginPage"; // Importing the LoginPage component.
import PrivacyPage from "./pages/PrivacyPage"; // Importing the PrivacyPage component.
import MoviePage from "./pages/MoviePage"; // Importing the MoviePage component.
import RegisterPage from "./pages/RegisterPage"; // Importing the RegisterPage component.
import BrowsePage from "./pages/BrowsePage"; // Importing the BrowsePage component.
import AdminPage from "./pages/AdminPage"; // Importing the AdminPage component.
import SearchResults from "./pages/SearchResults"; // Importing the SearchResults component.
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS for styling.
import FooterComponent from "./components/FooterComponent"; // Importing the FooterComponent for the footer.
import ScrollToTop from "./components/ScrollToTop"; // Importing the ScrollToTop component to reset scroll position.
import MoviePageWrapper from "./components/MoviePageWrapper"; // Importing the MoviePageWrapper component for movie details.

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual"; // Disabling automatic scroll restoration for consistent behavior.
}

/*---> Component <---*/
const App: React.FC = () => {
  return (
    <>
      <Router>
        <ScrollToTop /> {/* Ensures the page scrolls to the top on route changes */}
        <Routes>
          {/* Route definitions for the application */}
          <Route path="/" element={<HomePage />} /> {/* Home page route */}
          <Route path="/privacy" element={<PrivacyPage />} /> {/* Privacy policy page route */}
          <Route path="/login" element={<LoginPage />} /> {/* Login page route */}
          <Route path="/register" element={<RegisterPage />} /> {/* Registration page route */}
          <Route path="/browse" element={<BrowsePage />} /> {/* Browse page route */}
          <Route path="/movie/:slug" element={<MoviePageWrapper />} /> {/* Movie details page route */}
          <Route path="/admin" element={<AdminPage />} /> {/* Admin page route */}
          <Route path="/search" element={<SearchResults />} /> {/* Search results page route */}
        </Routes>
      </Router>
      <FooterComponent /> {/* Footer component */}
    </>
  );
};

export default App; // Exporting the App component as the default export.