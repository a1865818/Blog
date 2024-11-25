import axios from "axios"; // Import axios for making HTTP requests
import React, { useState } from "react"; // Import React and useState hook for managing local state
import { useContext } from "react"; // Import useContext hook to access context
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for programmatic navigation
import { AuthContext } from "../context/authContext"; // Import the AuthContext to manage user authentication

const Login = () => {
  // State to store input values for username and password
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  // State to store any error message that occurs during login
  const [err, setError] = useState(null);

  // useNavigate hook to programmatically navigate after successful login
  const navigate = useNavigate();

  // Destructure the 'login' function from AuthContext
  const { login } = useContext(AuthContext);


  // Handle change in input fields
  const handleChange = (e) => {
    // Update the state with the new input value while maintaining previous values
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission (login attempt)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Call the login function from context with the input values
      await login(inputs);
      // On success, navigate to the home page ("/")
      navigate("/");
    } catch (err) {
      // Set the error state to display the error message if the login fails
      setError(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <h1>Login</h1>
        <form>
          {/* Input for username */}
          <input
            required // Make the username field required
            type="text"
            placeholder="username"
            name="username"
            onChange={handleChange} // Update inputs state on change
          />
          {/* Input for password */}
          <input
            required // Make the password field required
            type="password"
            placeholder="password"
            name="password"
            onChange={handleChange} // Update inputs state on change
          />
          {/* Button to trigger form submission */}
          <button onClick={handleSubmit}>Login</button>
          {/* Button to sign in with Google */}
          <button onClick={() => window.location.href = "http://localhost:8800/api/auth/google"}>Sign In with Google</button>
          {/* Display error message if there's an error */}
          {err && <p>{JSON.stringify(err)}</p>}
          {/* Link to navigate to the registration page if the user doesn't have an account */}
          <span>
            Don't you have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
