import express from "express"; // Import the Express framework
import { register, login, logout, googleAuth, googleCallback, googleRedirect, getGoogleUser, googleLogout } from "../controllers/auth.js"; // Import authentication controller functions


const router = express.Router(); // Create a new instance of an Express router

// Route for user registration
// This handles POST requests to the "/register" endpoint and calls the `register` function from the auth controller
router.post("/register", register);

// Route for user login
// This handles POST requests to the "/login" endpoint and calls the `login` function from the auth controller
router.post("/login", login);

// Route for user logout
// This handles POST requests to the "/logout" endpoint and calls the `logout` function from the auth controller
router.post("/logout", logout);

// Route for Google OAuth
router.get("/google", googleAuth);

// Callback route for Google OAuth
router.get("/google/callback", googleCallback, googleRedirect);

// Route to get the Google user information
router.get("/google/user", getGoogleUser);

// Route for Google logout
router.get("/google/logout", googleLogout);

// Export the router to be used in the main application file
export default router;
