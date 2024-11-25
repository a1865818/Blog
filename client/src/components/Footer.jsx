import React from "react"; // Import the React library to create the component
import Logo from "../img/logo.png"; // Import the logo image to use in the footer

// Retrieve the current year
const year = new Date().getFullYear();

// Define the Footer functional component
const Footer = () => {
  return (
    // Footer HTML element to represent the footer section
    <footer>
      {/* Display the logo image */}
      <img src={Logo} alt="Logo" />
      
      {/* Display the footer text */}
      <span>
        <b>&copy; {year} Tuan Minh Nguyen</b>. All rights reserved.
      </span>
    </footer>
  );
};

// Export the Footer component for use in other parts of the application
export default Footer;
