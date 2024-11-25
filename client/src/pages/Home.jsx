import React from "react"; // Import React for component creation
import { useEffect } from "react"; // Import useEffect hook to perform side effects
import { useState } from "react"; // Import useState hook to manage state
import { Link, useLocation } from "react-router-dom"; // Import Link for navigation and useLocation for URL search params
import axios from "axios"; // Import axios for making HTTP requests

const Home = () => {
  // State to store the posts fetched from the API
  const [posts, setPosts] = useState([]);

  // Get the category (cat) from the URL query string using useLocation hook
  const cat = useLocation().search;

  // useEffect hook to fetch posts whenever the category (cat) changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Send a GET request to fetch posts based on the category
        const res = await axios.get(`/api/posts${cat}`);
        // Update the posts state with the data received from the API
        setPosts(res.data);
      } catch (err) {
        console.log(err); // Log any errors that occur during the fetch
      }
    };
    fetchData(); // Call the fetchData function to initiate the API request
  }, [cat]); // Dependency array ensures fetchData is called whenever 'cat' changes

  // Helper function to extract text content from HTML string
  const getText = (html) => {
    // Parse the HTML string into a DOM object and extract the text content
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <div className="home">
      <div className="posts">
        {/* Map over the posts array to display each post */}
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              {/* Display the post image, ensuring it starts with 'http' or default path */}
              <img src={post.img.startsWith("http") ? post.img : `../upload/${post.img}`} alt="" />
            </div>
            <div className="content">
              {/* Link to the individual post page using the post ID */}
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              {/* Display the description of the post or a default message if not available */}
              <p>{post.description ? getText(post.description) : "No description available"}</p>
              {/* Button linking to the full post */}
              <Link className="link" to={`/post/${post.id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
