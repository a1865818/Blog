import bcrypt from 'bcryptjs'; // Library for hashing and comparing passwords securely
import { db } from '../db.js'; // Importing database connection
import jwt from 'jsonwebtoken'; // Library for generating JSON Web Tokens (JWT)
import passport from 'passport'; // Import passport for authentication
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // Import Google OAuth strategy

/**
 * Register a new user
 * 1. Check if the user already exists (based on email or username).
 * 2. If not, hash the password and insert the new user into the database.
 */
export const register = (req, res) => {
  console.log("Register endpoint called");

  // Query to check if the user already exists
  const q = "SELECT * FROM users WHERE email = $1 OR username = $2";

  // Execute the query with email and username from the request body
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json(err); // Return 500 if there's a server/database error
    }

    if (data.rows.length > 0) {
      return res.status(409).json("User already exists"); // Return 409 conflict if the user exists
    }

    // Generate a salt and hash the user's password for security
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Query to insert a new user into the database
    const q = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
    const values = [req.body.username, req.body.email, hash];

    // Execute the query to insert the new user
    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json(err); // Return 500 if there's a server/database error
      }

      // Respond with success if the user was registered successfully
      res.status(200).json("User registered");
    });
  });
};

/**
 * Log in an existing user
 * 1. Find the user by their username.
 * 2. Validate the provided password against the hashed password in the database.
 * 3. Generate a JWT token and set it as a cookie.
 */
export const login = (req, res) => {
  console.log("Login endpoint called");

  // Query to find the user by username
  const q = "SELECT * FROM users WHERE username = $1";

  // Execute the query with the username from the request body
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json(err); // Return 500 if there's a server/database error
    }

    if (data.rows.length === 0) {
      return res.status(404).json("User not found"); // Return 404 if the user does not exist
    }

    // Validate the provided password using bcrypt
    const isPasswordValid = bcrypt.compareSync(req.body.password, data.rows[0].password);
    if (!isPasswordValid) {
      return res.status(400).json("Invalid password"); // Return 400 if the password is incorrect
    }

    // Generate a JWT token with the user's ID
    const token = jwt.sign({ id: data.rows[0].id }, "keySecret");

    // Exclude the password from the response for security reasons
    const { password, ...other } = data.rows[0];

    // Set the token as a cookie and return the user's data (excluding password)
    res.cookie("access_token", token, {
      httpOnly: true, // Cookie can only be accessed by the server
    }).status(200).json(other);
  });
};

/**
 * Log out the user
 * 1. Clear the JWT cookie.
 */
export const logout = (req, res) => {
  res.clearCookie("access_token") // Clear the access token cookie
    .status(200) // Return success status
    .json("User logged out"); // Inform the client that the user has been logged out
};

export const googleLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("access_token");
  });
};

// Configure passport to use Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: "767355889701-2f0rjitkdrivb21g2bt6on1bocgbfq49.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:8800/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Logic to find or create a user in the database
  const q = "SELECT * FROM users WHERE email = $1";
  db.query(q, [profile.emails[0].value], (err, data) => {
    if (err) return done(err);
    if (data.rows.length > 0) {
      const user = data.rows[0];
      const token = jwt.sign({ id: user.id }, "keySecret");
      user.token = token;
      return done(null, user);
    } else {
      const q = "INSERT INTO users (username, email, password, img) VALUES ($1, $2, $3, $4) RETURNING *";
      const values = [profile.displayName, profile.emails[0].value, "google", profile.photos[0].value];
      db.query(q, values, (err, data) => {
        if (err) return done(err);
        const user = data.rows[0];
        const token = jwt.sign({ id: user.id }, "keySecret");
        user.token = token;
        return done(null, user);
      });
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleCallback = passport.authenticate("google", {
  failureRedirect: "http://localhost:5173/login",
});

export const googleRedirect = (req, res) => {
  res.cookie("access_token", req.user.token, {
    httpOnly: true,
  });
  res.redirect("http://localhost:5173/");
};

export const getGoogleUser = (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).json({ message: "Not authenticated" });
  }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;
  // Verify the Google token and get user info
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();

  // Check if the user already exists in the database
  const q = "SELECT * FROM users WHERE email = $1";
  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.rows.length > 0) {
      // User exists, return the user data
      const user = data.rows[0];
      const token = jwt.sign({ id: user.id }, "keySecret");
      res.cookie("access_token", token, { httpOnly: true }).status(200).json({ user });
    } else {
      // User does not exist, create a new user
      const q = "INSERT INTO users (username, email, img) VALUES ($1, $2, $3) RETURNING *";
      const values = [name, email, picture];
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        const user = data.rows[0];
        const token = jwt.sign({ id: user.id }, "keySecret");
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({ user });
      });
    }
  });
};


