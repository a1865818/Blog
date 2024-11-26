import React, { useContext, useEffect, useState } from "react"; // Import React, useContext, useEffect, and useState hooks
import { Link } from "react-router-dom"; // Import Link component from react-router-dom for navigation
import { AuthContext } from "../context/authContext"; // Import AuthContext to access the current user and logout function
import Logo from "../img/logo.png"; // Import the logo image
import axios from "axios"; // Import axios for making HTTP requests

// Navbar component for displaying the navigation bar
const Navbar = () => {
  // Access current user and logout function from the AuthContext
  const { currentUser, logout } = useContext(AuthContext);
  const [googleUser, setGoogleUser] = useState(null);

  // This effect runs only when the currentUser changes
  // The effect fetches the Google user data if the user is authenticated
  // The Google user data is stored in the googleUser state
  // The effect runs only once when the component mounts
  useEffect(() => {
    const fetchGoogleUser = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/auth/google/user", { withCredentials: true });
        if (res.data.message !== "Not authenticated") {
          setGoogleUser(res.data);
        }
      } catch (err) {
        // Handle the error silently
      }
    };
    fetchGoogleUser();
  }, [currentUser]);

  return (
    <div className="navbar">
      <div className="container">
        {/* Logo section with a link to the home page */}
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        {/* Links for different categories and user authentication actions */}
        <div className="links">
          {/* Category links for filtering posts based on category */}
          <Link className="link" to="/?cat=art">
            <h6>ART</h6>
          </Link>
          <Link className="link" to="/?cat=science">
            <h6>SCIENCE</h6>
          </Link>
          <Link className="link" to="/?cat=technology">
            <h6>TECHNOLOGY</h6>
          </Link>
          <Link className="link" to="/?cat=cinema">
            <h6>CINEMA</h6>
          </Link>
          <Link className="link" to="/?cat=design">
            <h6>DESIGN</h6>
          </Link>
          <Link className="link" to="/?cat=food">
            <h6>FOOD</h6>
          </Link>
        </div>

        <div className="others">
          <div className="user-section">
            {(currentUser?.username || googleUser?.username) && (
              <span className="username">
                {currentUser?.username || googleUser?.username}
              </span>
            )}

            {currentUser || googleUser ? (
              <span className="auth-button logout" onClick={logout}>
                Logout
              </span>
            ) : (
              <Link className="auth-button login" to="/login">
                Login
              </Link>
            )}
          </div>

          {/* Write link, only visible if user is logged in */}
          <span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
