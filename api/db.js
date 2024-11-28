import pg from "pg"; // Import the `pg` module to interact with PostgreSQL
import dotenv from "dotenv"; // Import dotenv for environment variables

dotenv.config(); // Load environment variables from .env file

// Create a new connection pool for the PostgreSQL database
export const db = new pg.Pool({
  user: process.env.DB_USER, // Use environment variable for database username
  host: process.env.DB_HOST, // Use environment variable for database host
  password: process.env.DB_PASSWORD, // Use environment variable for database password
  database: process.env.DB_NAME, // Use environment variable for database name
  port: process.env.DB_PORT, // Use environment variable for database port
});
