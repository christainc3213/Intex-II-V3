import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";

function Register() {
  // State variables for form inputs and error handling
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password input
  const [error, setError] = useState(""); // Error message
  const navigate = useNavigate(); // Navigation hook
  const location = useLocation(); // Location hook to access query parameters

  // Prefill email if provided in the query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prefillEmail = params.get("email");
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [location.search]);

  // Navigate to the login page
  const handleLoginClick = () => {
    navigate("/login");
  };

  // Handle input changes for email, password, and confirm password
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  // Safely parse JSON from a response, handling empty responses
  const safeJson = async (response: Response) => {
    const length = response.headers.get("content-length");
    if (length && parseInt(length) > 0) {
      return await response.json();
    }
    return null;
  };

  // Handle form submission for registration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any previous error messages

    // Validate form inputs
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Enforce password requirements (12+ characters, at least 1 uppercase, 1 number)
    if (!/^(?=.*[A-Z])(?=.*\d).{12,}$/.test(password)) {
      setError(
        "Password must be at least 12 characters long, include at least 1 uppercase letter and 1 number."
      );
      return;
    }

    try {
      // Send registration request to the backend
      const registerResponse = await fetch(
        "https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
          body: JSON.stringify({ email, password }),
        }
      );

      const registerResult = await safeJson(registerResponse);

      // Handle registration errors
      if (!registerResponse.ok) {
        throw new Error(registerResult?.message || "Error registering.");
      }

      // Automatically log in the user after successful registration
      const loginUrl =
        "https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net/login?useCookies=true";
      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({ email, password }),
      });

      const loginResult = await safeJson(loginResponse);

      // Handle login errors
      if (!loginResponse.ok) {
        throw new Error(
          loginResult?.message || "Login failed after registration."
        );
      }

      // Navigate to the home page after successful login
      navigate("/");
    } catch (error: any) {
      console.error("Error in registration flow:", error);
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <HeaderComponent>
      <LoginHeroContent>
        <h1>Create Account</h1>
        <h2>Join CineNiche today</h2>

        {/* Registration form */}
        <FormWrapper onSubmit={handleSubmit}>
          <StyledInput
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={handleChange}
          />
          <StyledInput
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
          <StyledInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
          />

          {/* Display error message if any */}
          {error && <ErrorText>{error}</ErrorText>}

          <OptFormButton type="submit">
            <span>Register</span>
            <img src="/icons/chevron-right.png" alt="Register" />
          </OptFormButton>

          {/* Link to login page */}
          <RegisterText>
            Already have an account?{" "}
            <span onClick={handleLoginClick}>Log in</span>
          </RegisterText>
        </FormWrapper>
      </LoginHeroContent>
    </HeaderComponent>
  );
}
export default Register;

import styled from "styled-components";

// Styled components for styling the registration page
const LoginHeroContent = styled.div`
  max-width: 400px;
  margin: 0 auto;
  color: black;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: normal;
    margin-bottom: 2rem;
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 0 20px;
`;

const StyledInput = styled.input`
  width: 120%;
  max-width: 400px;
  height: 50px;
  padding: 0 15px;
  border-radius: 999px;
  border: none;
  font-size: 16px;
  outline: none;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: black;

  input {
    accent-color: #fff;
  }
`;

const ErrorText = styled.p`
  color: #ff4d4d;
  margin: 0;
  font-size: 14px;
`;

const RegisterText = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: black;

  span {
    color: rgb(98, 98, 98);
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }
`;

const OptFormButton = styled.button`
  position: relative;
  overflow: hidden;
  width: fit-content;
  height: 60px;
  background: #000;
  color: white;
  padding: 0 32px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 999px;

  img {
    margin-left: 10px;
    filter: brightness(0) invert(1);
    width: 24px;
    transition: filter 0.4s ease;
    position: relative;
    z-index: 3;
  }

  span {
    font-size: 16px;
    z-index: 3;
    color: white;
    transition: color 0.4s ease;
  }

  &:hover img {
    filter: none;
  }

  @media (max-width: 950px) {
    span {
      font-size: 14px;
    }
  }
`;
