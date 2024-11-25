import React, { useEffect, useState } from "react"; // Import React and hooks for component logic
import Edit from "../img/edit.png"; // Import the image for the edit icon
import Delete from "../img/delete.png"; // Import the image for the delete icon
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"; // Import react-router hooks for navigation
import Menu from "../components/Menu"; // Import the Menu component for showing categories
import axios from "axios"; // Import axios for making HTTP requests
import moment from "moment"; // Import moment.js for date formatting
import { useContext } from "react"; // Import useContext to access AuthContext
import { AuthContext } from "../context/authContext"; // Import the AuthContext to check user status
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML content

const Single = () => {
  const [post, setPost] = useState({}); // State to store the post data

  const { id } = useParams(); // Get the post id from URL parameters
  const navigate = useNavigate(); // Hook for navigating programmatically

  const { currentUser } = useContext(AuthContext); // Get the current logged-in user from context

  // useEffect hook to fetch the post data when the component mounts or id changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an API call to get the post details based on the post id
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data); // Set the post data to the state
      } catch (err) {
        console.log(err); // Log any errors that occur while fetching data
      }
    };
    fetchData(); // Call the function to fetch data
  }, [id]); // Dependency array to refetch data when the post id changes

  // Function to handle deleting the post
  const handleDelete = async () => {
    try {
      // Send a DELETE request to delete the post
      await axios.delete(`/api/posts/${id}`);
      navigate("/"); // Navigate back to the home page after deletion
    } catch (err) {
      console.log(err); // Log any errors that occur during deletion
    }
  };

  return (
    <div className="single">
      <div className="content">
        {/* Display the post image */}
        <img
          src={post.img && post.img.startsWith("http") ? post.img : `../upload/${post.img}`}
          alt=""
        />
        <div className="user">
          {/* Display user profile image if available */}
          {post.userImg && <img src={post.userImg} alt="" />}
          
          <div className="info">
            {/* Display the username and how long ago the post was made */}
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          
          {/* Only show the edit and delete buttons if the current user is the author of the post */}
          {currentUser?.username === post.username && (
            <div className="edit">
              {/* Link to the write page with the post data for editing */}
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              {/* Button to delete the post */}
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        
        {/* Display the post title */}
        <h1>{post.title}</h1>
        
        {/* Sanitize and display the post description */}
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.description), // Sanitize HTML to prevent XSS attacks
          }}
        ></p>
      </div>
      
      {/* Display the Menu component with the post's category */}
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
