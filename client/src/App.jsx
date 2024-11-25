// Importing necessary modules from React, React Router, and other components
import { createBrowserRouter, RouterProvider, Route, Outlet } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Write from "./pages/Write";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./style.scss";

// Layout component defines the general structure of the app's layout
// It includes the Navbar at the top, the Outlet where child routes render, and the Footer at the bottom
const Layout = () => {  
  return (
    <>
      {/* Navbar component for navigation */}
      <Navbar />
      
      {/* Outlet renders the content for the active route */}
      <Outlet />
      
      {/* Footer component for footer section */}
      <Footer />
    </>
  );
}

// Setting up the router with different routes for the application
const router = createBrowserRouter([
  {
    path: "/", // Base path for the app
    element: <Layout />, // Layout component renders for the base route
    children: [
      {
        path: "/", // Path for home page
        element: <Home />, // Home component will render here
      },
      {
        path: "/post/:id", // Dynamic route for individual posts
        element: <Single />, // Single component will render here with post id
      },
      {
        path: "/write", // Path for the write page where users can create a post
        element: <Write />, // Write component will render here
      },
    ],
  },
  {
    path: "/register", // Path for registration page
    element: <Register />, // Register component will render here
  },
  {
    path: "/login", // Path for login page
    element: <Login />, // Login component will render here
  },
]);

// Main App component where the RouterProvider is used to initialize the routing
function App() {
  return (
    <div className="app">
      <div className="container">
        {/* RouterProvider handles routing using the defined router */}
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
