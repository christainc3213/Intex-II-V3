import styled from "styled-components"; // Importing styled-components for styling.
import { useNavigate } from "react-router-dom"; // Importing useNavigate for programmatic navigation.
import { MovieType } from "../../types/MovieType"; // Importing the MovieType interface for type safety.
import { Helmet } from "react-helmet"; // Importing Helmet for managing the document head.

export interface FeaturedCarouselProps {
  featuredMovies: MovieType[]; // Array of featured movies.
  currentSlide: number; // Index of the currently active slide.
  setCurrentSlide: (index: number) => void; // Function to update the current slide.
  getPosterPath: (title: string) => string; // Function to generate the poster path for a movie.
  movies: MovieType[]; // Array of all movies.
  selectedGenre: string; // The currently selected genre.
}

const FeaturedCarousel = ({
  featuredMovies,
  currentSlide,
  setCurrentSlide,
  getPosterPath,
}: FeaturedCarouselProps) => {
  const navigate = useNavigate(); // Hook for navigation.
  const currentMovie = featuredMovies[currentSlide]; // Get the currently active movie.

  return (
    <>
      {/* Preload the video for the current movie */}
      <Helmet>
        {currentMovie && (
          <link
            rel="preload"
            as="video"
            href={
              currentMovie.docId === "s341"
                ? "/Movie Trailers/Inception.mp4" // Preload a specific video for a featured movie.
                : `/Movie Trailers/${currentMovie.title.replace(/[^\w\s]/g, "").trim()}.mp4` // Generate the video path dynamically.
            }
            type="video/mp4"
          />
        )}
      </Helmet>

      <CarouselWrapper>
        {/* Carousel container */}
        <Carousel style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {featuredMovies.map((movie, index) => (
            <CarouselItem key={index}>
              {/* Render a video backdrop for each movie */}
              {movie.docId === "s341" ? (
                <VideoBackdrop
                  src="/Movie Trailers/Inception.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <VideoBackdrop
                  src={`/Movie Trailers/${movie.title.replace(/[^\w\s]/g, "").trim()}.mp4`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={(e) => {
                    // Fallback to an image if the video fails to load.
                    const fallbackImg = document.createElement("img");
                    fallbackImg.src = getPosterPath(movie.title); // Use the poster path as the fallback.
                    fallbackImg.style.width = "100%";
                    fallbackImg.style.height = "100%";
                    fallbackImg.style.objectFit = "cover";
                    const parent = (e.target as HTMLVideoElement).parentElement;
                    if (parent) {
                      parent.replaceChild(fallbackImg, e.target as Node);
                    }
                  }}
                />
              )}

              {/* Overlay with movie details */}
              <Overlay>
                <h2>{movie.title}</h2> {/* Movie title */}
                <p>{movie.description}</p> {/* Movie description */}
                <button onClick={() => navigate(`/movie/${movie.slug}`)}>
                  Watch Now
                </button>
              </Overlay>
            </CarouselItem>
          ))}
        </Carousel>

        {/* Gradient fade effect at the bottom */}
        <GradientFade />

        {/* Dots for carousel navigation */}
        <Dots>
          {featuredMovies.map((_, index) => (
            <Dot
              key={index}
              $active={index === currentSlide} // Highlight the active dot.
              onClick={() => setCurrentSlide(index)} // Change the slide on dot click.
            />
          ))}
        </Dots>
      </CarouselWrapper>
    </>
  );
};

export default FeaturedCarousel; // Exporting the FeaturedCarousel component as the default export.

// Styled components for the carousel and its elements.

const CarouselWrapper = styled.div`
  margin-top: 0px; // No margin at the top.
  position: relative; // Position relative for child elements.
  overflow: hidden; // Hide overflowing content.
  width: 100%; // Full width of the container.
  height: 90vh; // Height of the carousel.
`;

const Carousel = styled.div`
  display: flex; // Use flexbox for layout.
  transition: transform 1.5s ease-in-out; // Smooth transition for slide changes.
  height: 100%; // Full height of the container.
`;

const CarouselItem = styled.div`
  flex: 1; // Flex item to take up equal space.
  position: relative; // Position relative for child elements.
  min-width: 100%; // Each item takes up the full width of the container.
`;

const Backdrop = styled.img`
  width: 100%; // Full width of the container.
  height: 100%; // Full height of the container.
  object-fit: cover; // Maintain aspect ratio and cover the container.
`;

const Overlay = styled.div`
  position: absolute; // Position absolutely within the container.
  bottom: 0; // Align to the bottom of the container.
  left: 0; // Align to the left of the container.
  width: 100%; // Full width of the container.
  padding: 3rem 2rem 6rem 2rem; // Padding inside the overlay.
  color: white; // Text color.
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 10%,
    rgba(18, 18, 18, 1) 90%
  ); // Gradient background.
  z-index: 2; // Set stacking order.

  h2 {
    font-size: 3.5rem; // Font size for the title.
    font-weight: 900; // Bold font weight.
    margin-bottom: 1rem; // Margin below the title.
    letter-spacing: -0.03em; // Adjust letter spacing.
    line-height: 1.1; // Line height for better readability.
  }

  p {
    max-width: 500px; // Maximum width for the description.
    font-size: 1.05rem; // Font size for the description.
    margin-bottom: 1rem; // Margin below the description.
  }

  button {
    background: black; // Button background color.
    color: white; // Button text color.
    border: none; // Remove border.
    padding: 8px 16px; // Padding inside the button.
    cursor: pointer; // Change cursor to pointer on hover.
    border-radius: 4px; // Rounded corners.
    font-weight: bold; // Bold font weight.
    transition: background 0.3s; // Smooth transition for background changes.
    &:hover {
      background: #222; // Change background color on hover.
    }
  }
`;

const GradientFade = styled.div`
  position: absolute; // Position absolutely within the container.
  bottom: -1px; // Align slightly below the container.
  left: 0; // Align to the left of the container.
  width: 100%; // Full width of the container.
  height: 80px; // Height of the gradient.
  background: linear-gradient(to bottom, transparent, #121212); // Gradient background.
  z-index: 1; // Set stacking order.
`;

const Dots = styled.div`
  position: absolute; // Position absolutely within the container.
  bottom: 70px; // Align above the bottom of the container.
  width: 100%; // Full width of the container.
  display: flex; // Use flexbox for layout.
  justify-content: center; // Center-align the dots.
  gap: 10px; // Spacing between dots.
  z-index: 3; // Set stacking order.
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 10px; // Width of the dot.
  height: 10px; // Height of the dot.
  border-radius: 50%; // Fully rounded corners.
  background: ${(props) => (props.$active ? "#000" : "#ccc")}; // Change color based on active state.
  border: ${(props) =>
    props.$active ? "2px solid #ccc" : "none"}; // Add a border for the active dot.
  transition: background 0.3s, border 0.3s; // Smooth transition for background and border changes.
  cursor: pointer; // Change cursor to pointer on hover.
`;

const VideoBackdrop = styled.video`
  width: 100%; // Full width of the container.
  height: 100%; // Full height of the container.
  object-fit: cover; // Maintain aspect ratio and cover the container.
`;