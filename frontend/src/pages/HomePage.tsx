import React, { useState } from "react"; // Importing React and the useState hook for managing state.
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation between routes.
import HeaderComponent from "../components/HeaderComponent"; // Importing the HeaderComponent for the page header.
// import FooterComponent from "../components/FooterComponent"; // Footer component (currently commented out).

const HomePage = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation.
  const [email, setEmail] = useState(""); // State to store the user's email input.

  // Function to handle the "Get Started" button click.
  const handleGetStarted = () => {
    if (email.trim()) {
      // Navigate to the registration page with the email as a query parameter.
      navigate(`/register?email=${encodeURIComponent(email)}`);
    } else {
      alert("Please enter a valid email."); // Show an alert if the email is invalid.
    }
  };

  return (
    // Render the header component with props for customization.
    <HeaderComponent showWhiteFilm={true} showSigninButton={true}>
      <HeroContent>
        {/* Main heading for the hero section */}
        <h1>Independent Films. Cult Classics. All in one place.</h1>
        {/* Subheading prompting the user to enter their email */}
        <h2>
          Ready to watch? Enter your email below to start your membership.
        </h2>
        <FormWrapper>
          {/* Input field for the user's email */}
          <EmailInput
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update the email state on input change.
          />
          {/* Button to trigger the "Get Started" action */}
          <OptFormButton onClick={handleGetStarted}>
            <span>Get Started</span>
            <img src="/icons/chevron-right.png" alt="Try Now" />
          </OptFormButton>
        </FormWrapper>
      </HeroContent>
    </HeaderComponent>
  );
};

export default HomePage; // Exporting the HomePage component as the default export.

import styled from "styled-components"; // Importing styled-components for styling.

// Styled component for the hero content section.
const HeroContent = styled.div`
  max-width: 600px; // Maximum width of the content.
  margin: 0 auto; // Center the content horizontally.
  color: black; // Text color.
  text-align: center; // Center-align the text.

  h1 {
    font-size: 3rem; // Font size for the main heading.
    font-weight: bold; // Bold font weight.
    margin-bottom: 1rem; // Margin below the heading.
  }

  h2 {
    font-size: 1.5rem; // Font size for the subheading.
    font-weight: normal; // Normal font weight.
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem; // Adjust font size for smaller screens.
    }

    h2 {
      font-size: 1.2rem; // Adjust font size for smaller screens.
    }
  }
`;

// Styled component for the form wrapper.
const FormWrapper = styled.div`
  display: flex; // Use flexbox for layout.
  justify-content: center; // Center the content horizontally.
  align-items: center; // Center the content vertically.
  gap: 1rem; // Add spacing between the email input and button.
  margin-top: 20px; // Margin above the form.
  margin-bottom: 70px; // Margin below the form.
  padding: 0 20px; // Horizontal padding.

  @media (max-width: 950px) {
    flex-direction: column; // Stack items vertically on smaller screens.
    align-items: center; // Center-align items.
    gap: 0.5rem; // Reduce spacing between items.
  }
`;

// Styled component for the email input field.
const EmailInput = styled.input`
  max-width: 450px; // Maximum width of the input field.
  width: 100%; // Full width of the container.
  border: 0; // Remove border.
  padding: 0 20px; // Horizontal padding inside the input.
  height: 60px; // Height of the input field.
  font-size: 20px; // Font size of the input text.
  border-radius: 999px; // Fully rounded corners.
  outline: none; // Remove outline on focus.
  vertical-align: middle; // Align text vertically.

  &::placeholder {
    color: #999; // Placeholder text color.
  }
`;

// Styled component for the "Get Started" button.
const OptFormButton = styled.button`
  position: relative; // Position relative for child elements.
  overflow: hidden; // Hide overflow content.
  width: fit-content; // Adjust width to fit content.
  height: 60px; // Height of the button.
  background: #000; // Button background color.
  color: white; // Button text color.
  padding: 0 32px; // Horizontal padding inside the button.
  border: none; // Remove border.
  cursor: pointer; // Change cursor to pointer on hover.
  display: flex; // Use flexbox for layout.
  align-items: center; // Center-align items vertically.
  border-radius: 999px; // Fully rounded corners.

  img {
    margin-left: 10px; // Margin to the left of the image.
    filter: brightness(0) invert(1); // Invert image colors.
    width: 24px; // Width of the image.
    transition: filter 0.4s ease; // Smooth transition for filter changes.
    position: relative; // Position relative for stacking.
    z-index: 3; // Set stacking order.
  }

  span {
    font-size: 16px; // Font size of the button text.
    z-index: 3; // Set stacking order.
    color: white; // Text color.
    transition: color 0.4s ease; // Smooth transition for color changes.
  }

  &:hover img {
    filter: none; // Remove filter on hover.
  }

  @media (max-width: 950px) {
    span {
      font-size: 14px; // Adjust font size for smaller screens.
    }
  }
`;
