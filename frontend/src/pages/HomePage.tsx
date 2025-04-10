import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
// import FooterComponent from "../components/FooterComponent";

const HomePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleGetStarted = () => {
    if (email.trim()) {
      navigate(`/register?email=${encodeURIComponent(email)}`);
    } else {
      alert("Please enter a valid email.");
    }
  };

  return (
      <HeaderComponent showWhiteFilm={true} showSigninButton = {true}>
      <HeroContent>
        <h1>Independent Films. Cult Classics. All in one place.</h1>
        <h2>
          Ready to watch? Enter your email below to start your membership.
        </h2>
        <FormWrapper>
          <EmailInput
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <OptFormButton onClick={handleGetStarted}>
            <span>Get Started</span>
            <img src="/icons/chevron-right.png" alt="Try Now" />
          </OptFormButton>
        </FormWrapper>
      </HeroContent>
    </HeaderComponent>
  );
};

export default HomePage;

import styled from "styled-components";

const HeroContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  color: black;
  text-align: center;

  h1 {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: normal;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.2rem;
    }
  }
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem; /* 👈 adds spacing between email and button */
  margin-top: 20px;
  margin-bottom: 70px;
  padding: 0 20px;

  @media (max-width: 950px) {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
`;

const EmailInput = styled.input`
  max-width: 450px;
  width: 100%;
  border: 0;
  padding: 0 20px;
  height: 60px;
  font-size: 20px;
  border-radius: 999px;
  outline: none;
  vertical-align: middle;


  &::placeholder {
    color: #999;
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
    font-size: 16px; /* 👈 Just shrink the text */
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
