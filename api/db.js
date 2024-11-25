import pg from "pg"; // Import the `pg` module to interact with PostgreSQL

// Create a new connection pool for the PostgreSQL database
export const db = new pg.Pool({
  user: "postgres", // Database username
  host: "localhost", // Host where the database server is running 
  password: "123456", // Password for the database user
  database: "blog", // Name of the database to connect to
  port: 5432, // Port number for the PostgreSQL server 
});
