import axios from "axios"; // Import axios for making HTTP requests
import { createContext, useEffect, useState } from "react"; // Import React hooks and createContext

// Create a context to share authentication data across components
export const AuthContext = createContext();

// AuthProvider component to manage authentication state and provide context to children components
export const AuthProvider = ({ children }) => {
  // Initialize currentUser state from localStorage or set it to null if not available
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Login function to handle user authentication
  const login = async (inputs) => {
    // Make an API request to login the user with provided inputs (credentials)
    const res = await axios.post("/api/auth/login", inputs);
    // Set the currentUser state with the data returned from the API
    setCurrentUser(res.data);
  };

  // Logout function to handle user logout
  const logout = async () => {
    // Make an API request to log out the user
    await axios.post("/api/auth/logout");
    // Set the currentUser state to null after successful logout
    setCurrentUser(null);
  };

  // useEffect hook to persist the currentUser state in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]); // Dependency array ensures that it runs whenever currentUser state changes

  return (
    // Provide the authentication data (currentUser, login, logout) to the children components
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
