import { useState } from "react"; // Importing useState hook for managing component state.
import { useNavigate } from "react-router-dom"; // Importing useNavigate for programmatic navigation.
import HeaderComponent from "../components/HeaderComponent"; // Importing the HeaderComponent for the page header.

function LoginPage() {
  // State variables for email, password, and "remember me" checkbox.
  const [email, setEmail] = useState<string>(""); // State to store the user's email input.
  const [password, setPassword] = useState<string>(""); // State to store the user's password input.
  const [rememberme, setRememberme] = useState<boolean>(false); // State to track the "remember me" checkbox.

  // State variable for error messages.
  const [error, setError] = useState<string>(""); // State to store error messages.
  const navigate = useNavigate(); // Hook for programmatic navigation.

  // Handle change events for input fields.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target; // Destructure event target properties.
    if (type === "checkbox") {
      setRememberme(checked); // Update "remember me" state for checkbox.
    } else if (name === "email") {
      setEmail(value); // Update email state.
    } else if (name === "password") {
      setPassword(value); // Update password state.
    }
  };

  // Handle click event for the "Register" link.
  const handleRegisterClick = () => {
    navigate("/register"); // Navigate to the registration page.
  };

  // Handle submit event for the login form.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior.
    setError(""); // Clear any previous error messages.

    // Validate that both email and password fields are filled.
    if (!email || !password) {
      setError("Please fill in all fields."); // Set error message if fields are empty.
      return;
    }

    // Determine the login URL based on the "remember me" checkbox state.
    const loginUrl = rememberme
      ? "https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/login?useCookies=true"
      : "https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/login?useSessionCookies=true";

    try {
      // Send a POST request to the login endpoint.
      const response = await fetch(loginUrl, {
        method: "POST", // HTTP method for the request.
        credentials: "include", // Include cookies in the request.
        headers: { "Content-Type": "application/json" }, // Set content type to JSON.
        body: JSON.stringify({ email, password }), // Send email and password in the request body.
      });

      // Parse the response JSON only if there is content.
      let data = null;
      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json(); // Parse the response JSON.
      }

      // Handle unsuccessful responses.
      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password."); // Throw an error with the response message.
      }

      navigate("/browse"); // Navigate to the browse page on successful login.
    } catch (error: any) {
      setError(error.message || "Error logging in."); // Set error message if login fails.
      console.error("Fetch attempt failed:", error); // Log the error to the console.
    }
  };

  return (
    <HeaderComponent
      backgroundSrc="/bigback.png" // Background image for the header.
      showSigninButton={false} // Hide the "Sign In" button in the header.
    >
      <LoginHeroContent>
        {/* Page heading */}
        <h1>Welcome Back</h1>
        {/* Subheading */}
        <h2>Please log in to continue</h2>

        {/* Login form */}
        <FormWrapper onSubmit={handleSubmit}>
          {/* Email input field */}
          <StyledInput
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={handleChange} // Update email state on input change.
          />
          {/* Password input field */}
          <StyledInput
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange} // Update password state on input change.
          />
          {/* "Remember me" checkbox */}
          <CheckboxWrapper>
            <input
              type="checkbox"
              id="rememberme"
              name="rememberme"
              checked={rememberme}
              onChange={handleChange} // Update "remember me" state on checkbox change.
            />
            <label htmlFor="rememberme">Remember me</label>
          </CheckboxWrapper>
          {/* Display error message if present */}
          {error && <ErrorText>{error}</ErrorText>}

          {/* Submit button */}
          <OptFormButton type="submit">
            <span>Sign In</span>
            <img src="/icons/chevron-right.png" alt="Sign In" />
          </OptFormButton>

          {/* Link to the registration page */}
          <RegisterText>
            Don’t have an account?{" "}
            <span onClick={handleRegisterClick}>Register here</span>
          </RegisterText>
        </FormWrapper>
      </LoginHeroContent>
    </HeaderComponent>
  );
}

export default LoginPage; // Export the LoginPage component as the default export.

import styled from "styled-components"; // Importing styled-components for styling.

// Styled component for the login hero content section.
const LoginHeroContent = styled.div`
  max-width: 400px; // Maximum width of the content.
  margin: 0 auto; // Center the content horizontally.
  color: black; // Text color.
  text-align: center; // Center-align the text.

  h1 {
    font-size: 2.5rem; // Font size for the main heading.
    font-weight: bold; // Bold font weight.
    margin-bottom: 1rem; // Margin below the heading.
  }

  h2 {
    font-size: 1.25rem; // Font size for the subheading.
    font-weight: normal; // Normal font weight.
    margin-bottom: 2rem; // Margin below the subheading.
  }
`;

// Styled component for the form wrapper.
const FormWrapper = styled.form`
  display: flex; // Use flexbox for layout.
  flex-direction: column; // Stack items vertically.
  gap: 16px; // Add spacing between form elements.
  align-items: center; // Center-align items horizontally.
  padding: 0 20px; // Horizontal padding.
`;

// Styled component for the input fields.
const StyledInput = styled.input`
  width: 120%; // Width of the input field.
  max-width: 400px; // Maximum width of the input field.
  height: 50px; // Height of the input field.
  padding: 0 15px; // Horizontal padding inside the input.
  border-radius: 999px; // Fully rounded corners.
  border: none; // Remove border.
  font-size: 16px; // Font size of the input text.
  outline: none; // Remove outline on focus.
`;

// Styled component for the "Remember me" checkbox wrapper.
const CheckboxWrapper = styled.label`
  display: flex; // Use flexbox for layout.
  align-items: center; // Center-align items vertically.
  gap: 10px; // Add spacing between the checkbox and label.
  font-size: 14px; // Font size of the label text.
  color: black; // Text color.

  input {
    accent-color: #ffffff; // Checkbox accent color.
  }
`;

// Styled component for displaying error messages.
const ErrorText = styled.p`
  color: #ff4d4d; // Error text color.
  margin: 0; // Remove margin.
  font-size: 14px; // Font size of the error text.
`;

// Styled component for the registration link text.
const RegisterText = styled.p`
  margin-top: 20px; // Margin above the text.
  font-size: 14px; // Font size of the text.
  color: black; // Text color.

  span {
    color: rgb(98, 98, 98); // Link text color.
    text-decoration: underline; // Underline the link text.
    cursor: pointer; // Change cursor to pointer on hover.

    &:hover {
      color: #fff; // Change link text color on hover.
    }
  }
`;

// Styled component for the "Sign In" button.
const OptFormButton = styled.button`
  position: relative; // Position relative for child elements.
  overflow: hidden; // Hide overflow content.
  width: fit-content; // Adjust width to fit content.
  height: 45px; // Height of the button.
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
    width: 14px; // Width of the image.
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
