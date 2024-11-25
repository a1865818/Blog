import express from "express"; // Import the Express framework
import { getPost, getPosts, addPost, updatePost, deletePost } from "../controllers/post.js"; // Import post controller functions

const router = express.Router(); // Create a new instance of an Express router

// Test route for adding a post
// This is for testing purposes and calls the `addPost` function
router.get("/test", addPost);

// Route to fetch all posts
// Handles GET requests to the root "/" endpoint and calls the `getPosts` function from the post controller
router.get("/", getPosts);

// Route to fetch a single post by ID
// Handles GET requests to "/:id" (dynamic ID parameter) and calls the `getPost` function
router.get("/:id", getPost);

// Route to add a new post
// Handles POST requests to the root "/" endpoint and calls the `addPost` function
router.post("/", addPost);

// Route to delete a post by ID
// Handles DELETE requests to "/:id" (dynamic ID parameter) and calls the `deletePost` function
router.delete("/:id", deletePost);

// Route to update a post by ID
// Handles PATCH requests to "/:id" (dynamic ID parameter) and calls the `updatePost` function
router.patch("/:id", updatePost);

// Export the router to be used in the main application file
export default router;
