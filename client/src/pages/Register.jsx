import React from "react"; // Import React for using JSX
import { useState } from "react"; // Import useState for managing component state
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for programmatic navigation
import axios from "axios"; // Import axios for making HTTP requests

const Register = () => {
  // State to store input values for username, email, and password
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State to store any error message that occurs during registration
  const [err, setError] = useState(null);

  // useNavigate hook for programmatic navigation after successful registration
  const navigate = useNavigate();

  // Handle change in input fields
  const handleChange = (e) => {
    // Update the state with the new input value while maintaining previous values
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission (registration attempt)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send a POST request to register the user with the provided input values
      await axios.post("/api/auth/register", inputs);
      // On success, navigate to the login page
      navigate("/login");
    } catch (err) {
      // Set the error state to display the error message if the registration fails
      setError(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <h1>Register</h1>
        <form>
          {/* Input for username */}
          <input
            required // Make the username field required
            type="text"
            placeholder="username"
            name="username"
            onChange={handleChange} // Update inputs state on change
          />
          {/* Input for email */}
          <input
            required // Make the email field required
            type="email"
            placeholder="email"
            name="email"
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
          <button onClick={handleSubmit}>Register</button>
          <button onClick={() => window.location.href = "http://localhost:8800/api/auth/google"}>Sign Up with Google</button>
          {/* Display error message if there's an error */}
          {err && <p>{JSON.stringify(err)}</p>}
          {/* Link to navigate to the login page if the user already has an account */}
          <span>
            Do you have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
