import { db } from '../db.js'; // Importing the database connection
import jwt from 'jsonwebtoken'; // Importing JSON Web Token library for user authentication

/**
 * Fetch all posts or posts by category
 * If a category query parameter is provided, fetch posts of that category.
 */
export const getPosts = (req, res) => {
    // Determine query based on the presence of category query parameter
    const q = req.query.cat ? 
        "SELECT * FROM posts WHERE cat = $1 ORDER BY date DESC" : 
        "SELECT * FROM posts ORDER BY date DESC";
    const values = req.query.cat ? [req.query.cat] : [];

    // Execute the database query
    db.query(q, values, (err, data) => {
        if (err) {
            console.error("Error executing query", err);
            return res.status(500).send(err); // Return 500 if there's a server/database error
        }
        return res.status(200).json(data.rows); // Return the retrieved posts
    });
}

/**
 * Fetch a single post by its ID
 * Includes additional details like username, user image, and post metadata.
 */
export const getPost = (req, res) => {
    // Query to join users and posts tables to get detailed post information
    const q = "SELECT username, title, description, p.img, u.img AS userImg, cat, date FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = $1";

    // Execute the query with the post ID from request parameters
    db.query(q, [req.params.id], (err, data) => {
        if (err) {
            return res.status(500).send(err); // Return 500 if there's a server/database error
        }
        return res.status(200).json(data.rows[0]); // Return the post details
    });
}

/**
 * Add a new post
 * Requires a valid JWT token for authentication and assigns the post to the logged-in user.
 */
export const addPost = (req, res) => {
    const token = req.cookies.access_token; // Retrieve the JWT token from cookies
    if (!token) {
        return res.status(401).json("Unauthorized"); // Return 401 if no token is provided
    }

    // Verify the token and extract user information
    jwt.verify(token, "keySecret", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Forbidden"); // Return 403 if the token is invalid
        }

        // Query to insert a new post
        const q = "INSERT INTO posts (title, description, img, cat, date, uid) VALUES ($1, $2, $3, $4, $5, $6)";
        const values = [req.body.title, req.body.description, req.body.img, req.body.cat, req.body.date, userInfo.id];

        // Execute the query to insert the post
        db.query(q, values, (err, data) => {
            if (err) {
                console.error("Error executing query", err);
                console.error("Query values:", values); // Log query values for debugging
                return res.status(500).send(err); // Return 500 if there's a server/database error
            }
            return res.status(201).json("Post added"); // Return 201 if the post was added successfully
        });
    });
}

/**
 * Delete a post
 * Requires a valid JWT token and ensures that only the owner can delete their post.
 */
export const deletePost = (req, res) => {
    const token = req.cookies.access_token; // Retrieve the JWT token from cookies
    if (!token) {
        return res.status(401).json("Unauthorized"); // Return 401 if no token is provided
    }

    // Verify the token and extract user information
    jwt.verify(token, "keySecret", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Forbidden"); // Return 403 if the token is invalid
        }

        const postId = req.params.id; // Get the post ID from request parameters
        const q = "DELETE FROM posts WHERE id = $1 AND uid = $2"; // Ensure the post belongs to the user

        // Execute the query to delete the post
        db.query(q, [postId, userInfo.id], (err, data) => {
            if (err) {
                return res.status(403).send(err); // Return 403 if the user is not authorized to delete the post
            }
            return res.status(200).json("Post deleted"); // Return 200 if the post was deleted successfully
        });
    });
}

/**
 * Update a post
 * Requires a valid JWT token and ensures that only the owner can update their post.
 */
export const updatePost = (req, res) => {
    const token = req.cookies.access_token; // Retrieve the JWT token from cookies
    if (!token) {
        return res.status(401).json("Unauthorized"); // Return 401 if no token is provided
    }

    // Verify the token and extract user information
    jwt.verify(token, "keySecret", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Forbidden"); // Return 403 if the token is invalid
        }

        const postId = req.params.id; // Get the post ID from request parameters
        const q = "UPDATE posts SET title = $1, description = $2, img = $3, cat = $4 WHERE id = $5 AND uid = $6";
        const values = [req.body.title, req.body.description, req.body.img, req.body.cat, postId, userInfo.id];

        // Execute the query to update the post
        db.query(q, values, (err, data) => {
            if (err) {
                return res.status(500).json(err); // Return 500 if there's a server/database error
            }
            return res.status(200).json("Post updated"); // Return 200 if the post was updated successfully
        });
    });
}
