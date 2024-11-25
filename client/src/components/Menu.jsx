import axios from "axios"; // Import Axios for making HTTP requests
import React, { useEffect, useState } from "react"; // Import React hooks for managing state and side effects

// Menu component for displaying related posts
const Menu = ({ cat }) => {
  // State to hold the list of posts
  const [posts, setPosts] = useState([]);

  // useEffect to fetch data when the component mounts or when 'cat' changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch posts, optionally filtering by category
        const res = await axios.get(`/api/posts${cat ? `?cat=${cat}` : ""}`);
        setPosts(res.data); // Update the posts state with the fetched data
      } catch (err) {
        console.log(err); // Log any errors that occur during the fetch
      }
    };
    fetchData(); // Call the function to fetch data
  }, [cat]); // Dependency array ensures this effect runs when 'cat' changes

  // Render the component
  return (
    <div className="menu">
      {/* Heading for the related posts section */}
      <h1>Other posts you may like</h1>
      
      {/* Map through the posts and render each post */}
      {posts.map((post) => (
        <div className="post" key={post.id}>
          {/* Display the post image, handling cases where the image URL may be relative */}
          <img
            src={post.img && post.img.startsWith("http") ? post.img : `../upload/${post.img}`}
            alt=""
          />
          {/* Display the post title */}
          <h2>{post.title}</h2>
          {/* Button to read more about the post (functionality not yet implemented) */}
          <button>Read More</button>
        </div>
      ))}
    </div>
  );
};

// Export the Menu component for use in other parts of the application
export default Menu;
