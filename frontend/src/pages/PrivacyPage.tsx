import styled from "styled-components"; // Importing styled-components for styling.
import { useNavigate } from "react-router-dom"; // Importing useNavigate for programmatic navigation.
import { ReactNode } from "react"; // Importing ReactNode for type safety when using React components.

const PrivacyPage = () => {
  const navigate = useNavigate(); // Hook for navigation between routes.

  return (
    <>
      <PageWrapper>
        <TopNav>
          <Logo onClick={() => navigate("/")} /> {/* Logo that navigates to the home page when clicked */}
        </TopNav>

        <ContentContainer>
          {/* Main heading for the privacy policy */}
          <h1>Privacy Policy for CineNiche</h1>
          <p>
            <strong>Effective Date:</strong> <i>April 7, 2025</i>
          </p>

          {/* Introduction to the privacy policy */}
          <p>
            At CineNiche, your privacy is important to us. This Privacy Policy
            explains how we collect, use, and protect your personal information
            when you use our web application.
          </p>

          {/* Section 1: Information collected */}
          <SectionTitle>1. Information We Collect</SectionTitle>
          <p>
            When you use CineNiche, we may collect the following types of
            personal information:
          </p>
          <ul>
            <li>
              <strong>Location Data:</strong> City, State, ZIP code
            </li>
            <li>
              <strong>Demographic Data:</strong> Age, Gender
            </li>
            <li>
              <strong>Preference Data:</strong> Viewing history, likes,
              interactions
            </li>
          </ul>

          {/* Section 2: How the information is used */}
          <SectionTitle>2. How We Use Your Information</SectionTitle>
          <p>We use your information for:</p>
          <ul>
            <li>Personalizing your content experience</li>
            <li>Generating machine learning-based recommendations</li>
            <li>Improving our platform and user experience</li>
            <li>Analyzing user trends and behavior</li>
          </ul>

          {/* Section 3: Data sharing and disclosure */}
          <SectionTitle>3. Data Sharing and Disclosure</SectionTitle>
          <p>
            We do not sell or rent your data. We may share anonymized analytics
            data with partners, and limited personal data with trusted service
            providers bound by confidentiality.
          </p>

          {/* Section 4: Data security */}
          <SectionTitle>4. Data Security</SectionTitle>
          <p>
            We protect your data with encryption, access controls, and secure
            storage practices.
          </p>

          {/* Section 5: User choices */}
          <SectionTitle>5. Your Choices</SectionTitle>
          <p>You may:</p>
          <ul>
            <li>Update your personal info in your account settings</li>
            <li>Request account and data deletion</li>
            <li>
              Opt out of personalized recommendations (note: this may affect
              your experience)
            </li>
          </ul>

          {/* Section 6: Children's privacy */}
          <SectionTitle>6. Children’s Privacy</SectionTitle>
          <p>
            CineNiche does not knowingly collect data from users under 13. If
            discovered, we will promptly delete such data.
          </p>

          {/* Section 7: Policy changes */}
          <SectionTitle>7. Changes to This Policy</SectionTitle>
          <p>
            We may update this policy periodically. Significant changes will be
            communicated via app/email. Continued use of CineNiche implies
            acceptance.
          </p>

          {/* Section 8: Contact information */}
          <SectionTitle>8. Contact Us</SectionTitle>
          <p>
            If you have any questions, reach out at: <br />
            <strong>Email:</strong> support@cineniche.com
          </p>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default PrivacyPage; // Exporting the PrivacyPage component as the default export.

// Styled component for the page wrapper.
const PageWrapper = styled.div`
  min-height: 100vh; // Minimum height of the page.
  padding: 0px 24px 60px 24px; // Padding around the content.

  background-image: url("/bigback.png"); // Background image for the page.
  background-size: cover; // Cover the entire background.
  background-position: center center; // Center the background image.
  background-repeat: no-repeat; // Do not repeat the background image.
  background-attachment: fixed; // Fix the background image during scrolling.

  color: black; // Text color.
`;

// Styled component for the content container.
const ContentContainer = styled.div`
  max-width: 800px; // Maximum width of the content.
  margin: 0 auto; // Center the content horizontally.
  font-size: 1rem; // Font size for the text.
  line-height: 1.6; // Line height for better readability.
  background: rgba(255, 255, 255, 0.8); // Semi-transparent white background.
  padding: 50px; // Padding inside the container.
  border-radius: 12px; // Rounded corners.

  h1 {
    font-size: 2.5rem; // Font size for the main heading.
    font-weight: 700; // Bold font weight.
    margin-bottom: 1rem; // Margin below the heading.
    text-align: center; // Center-align the heading.
  }

  p {
    margin-bottom: 1rem; // Margin below paragraphs.
  }

  ul {
    margin-left: 1.5rem; // Indent unordered lists.
    margin-bottom: 1rem; // Margin below lists.
  }

  li {
    margin-bottom: 0.5rem; // Margin below list items.
  }
`;

// Styled component for section titles.
const SectionTitle = styled.h2`
  font-size: 1.5rem; // Font size for section titles.
  font-weight: 600; // Bold font weight.
  margin-top: 2rem; // Margin above the title.
  margin-bottom: 0.5rem; // Margin below the title.
  color: black; // Text color.
`;

// Styled component for the navigation bar.
const Navbar = styled.nav`
  max-width: 1850px; // Maximum width of the navbar.
  width: 100%; // Full width of the container.
  display: flex; // Use flexbox for layout.
  align-items: center; // Center-align items vertically.
  justify-content: space-between; // Space out items horizontally.
  margin-bottom: 175px; // Margin below the navbar.
  margin-right: auto; // Center the navbar horizontally.
  margin-left: auto;

  @media (max-width: 550px) {
    margin-bottom: 100px; // Adjust margin for smaller screens.
  }
`;

// Styled component for the logo.
const Logo = styled.img.attrs({
  src: "/logo.png", // Source of the logo image.
  alt: "CineNiche logo", // Alt text for the logo.
})`
  height: 50px; // Height of the logo.
  width: 220px; // Width of the logo.
  cursor: pointer; // Change cursor to pointer on hover.
`;

// Styled component for the top navigation bar.
const TopNav = styled.div`
  display: flex; // Use flexbox for layout.
  justify-content: space-between; // Space out items horizontally.
  align-items: center; // Center-align items vertically.
  padding: 30px 26px; // Padding inside the navigation bar.

  @media (max-width: 550px) {
    padding: 20px; // Adjust padding for smaller screens.
  }
`;

// Styled component for a white box container.
const WhiteBox = styled.div`
  background: white; // White background color.
  color: black; // Text color.
  padding: 40px; // Padding inside the box.
  border-radius: 12px; // Rounded corners.
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2); // Box shadow for depth.
  max-width: 850px; // Maximum width of the box.
  margin: 80px auto; // Center the box with spacing.
  backdrop-filter: blur(6px); // Apply a blur effect to the background.
`;
