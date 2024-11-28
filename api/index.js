import express from "express"; // Import Express framework
import authRoutes from "./routes/auth.js"; // Import authentication-related routes
import postRoutes from "./routes/posts.js"; // Import post-related routes
import userRoutes from "./routes/users.js"; // Import user-related routes
import cookieParser from "cookie-parser"; // Import middleware for parsing cookies
import cors from "cors"; // Import CORS middleware to handle cross-origin requests
import multer from "multer"; // Import multer for handling file uploads
import path from "path"; // Import path module for handling file paths
import { fileURLToPath } from "url"; // Import for getting file URL
import { dirname } from "path"; // Import for getting directory name
import passport from "passport"; // Import passport for authentication
import session from "express-session"; // Import express-session for session management
import dotenv from "dotenv"; // Import dotenv for environment variables

dotenv.config(); // Load environment variables from .env file

// Set up directory name and file name references
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

const app = express(); // Initialize an Express application

// Set up middleware
app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true // Allow credentials
})); // Enable CORS for the specified frontend URL

app.use(express.json()); // Middleware to parse JSON bodies in requests
app.use(cookieParser()); // Middleware to parse cookies
// Configure express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Use environment variable for session secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// passport middleware
// Initialize passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());
// Set up routes
app.use("/api/posts", postRoutes); // Route group for post-related APIs
app.use("/api/users", userRoutes); // Route group for user-related APIs
app.use("/api/auth", authRoutes); // Route group for authentication-related APIs

// Handle the root path
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Configure storage settings for file uploads
const storage = multer.diskStorage({
  // Specify the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../client/public/upload"));
  },
  // Specify the filename format for uploaded files
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append current timestamp to the file's original extension
  },
});

// Create a multer instance with the configured storage settings
const upload = multer({ storage });

// API endpoint for file uploads
app.post("/api/upload", upload.single("file"), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json("No file uploaded");
  }
  const file = req.file; // Access the uploaded file
  res.status(200).json(file.filename); // Respond with the uploaded file's name
});

// Start the server on port 8800
app.listen(process.env.PORT || 8800, () => {
  console.log(`Server is running on port ${process.env.PORT || 8800}`);
});
