import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  // Get the post state from the location if editing an existing post
  const state = useLocation().state;
  
  // Set initial values for title, description, category, and image (if editing)
  const [value, setValue] = useState(state?.description || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  
  // Reference to the Quill editor for observing changes
  const editorRef = useRef(null);
  
  // Navigation hook for redirecting after submitting the post
  const navigate = useNavigate();

  // Function to upload the file to the server and return the file URL
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData);
      return res.data;  // Return the URL of the uploaded image
    } catch (err) {
      console.log(err);  // Log any errors during upload
    }
  };

  // Function to handle the click event for publishing or updating a post
  const handleClick = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    
    // Upload the image if a new file is selected, otherwise use the existing image URL
    const imgUrl = file ? await upload() : state?.img;

    try {
      if (state && state.id) {
        // If the state contains an ID, update the existing post
        await axios.put(`/api/posts/${state.id}`, {
          title,
          description: value,
          cat,
          img: imgUrl,
        }, { withCredentials: true });
      } else {
        // Otherwise, create a new post
        await axios.post(`/api/posts/`, {
          title,
          description: value,
          cat,
          img: imgUrl,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),  // Set the current date as the post date
        }, { withCredentials: true });
      }
      navigate("/");  // Redirect to the homepage after submission
    } catch (err) {
      console.log(err);  // Log any errors during post creation or update
    }
  };

  // Observe the editor for any changes (child elements added/removed)
  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log("A child node has been added or removed.");
        }
      }
    });

    // Start observing the editorRef element
    if (editorRef.current) {
      observer.observe(editorRef.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();  // Cleanup the observer when the component is unmounted
    };
  }, []);

  // return (
  //   <div className="add">
  //     <div className="content">
  //       {/* Title input field */}
  //       <input
  //         type="text"
  //         placeholder="Title"
  //         value={title}
  //         onChange={(e) => setTitle(e.target.value)}  // Update title state on input change
  //       />
        
  //       {/* ReactQuill editor for the post content */}
  //       <div className="editorContainer" ref={editorRef}>
  //         <ReactQuill
  //           className="editor"
  //           theme="snow"
  //           value={value}
  //           onChange={setValue}  // Update the content (description) state
  //         />
  //       </div>
  //     </div>

  //     <div className="menu">
  //       <div className="item">
  //         <h1>Publish</h1>
  //         <span>
  //           <b>Status: </b> Draft
  //         </span>
  //         <span>
  //           <b>Visibility: </b> Public
  //         </span>
          
  //         {/* File input for uploading an image */}
  //         <input
  //           style={{ display: "none" }}
  //           type="file"
  //           id="file"
  //           onChange={(e) => setFile(e.target.files[0])}  // Set selected file
  //         />
  //         <label className="file" htmlFor="file">
  //           Upload Image
  //         </label>

  //         <div className="buttons">
  //           <button>Save as a draft</button>
  //           <button onClick={handleClick}>Publish</button>
  //         </div>
  //       </div>

  //       {/* Category selection section */}
  //       <div className="item">
  //         <h1>Category</h1>
  //         <div className="cat">
  //           <input
  //             type="radio"
  //             checked={cat === "art"}
  //             name="cat"
  //             value="art"
  //             id="art"
  //             onChange={(e) => setCat(e.target.value)}  // Update category on selection
  //           />
  //           <label htmlFor="art">Art</label>
  //         </div>
  //         <div className="cat">
  //           <input
  //             type="radio"
  //             checked={cat === "science"}
  //             name="cat"
  //             value="science"
  //             id="science"
  //             onChange={(e) => setCat(e.target.value)}  // Update category on selection
  //           />
  //           <label htmlFor="science">Science</label>
  //         </div>
  //         <div className="cat">
  //           <input
  //             type="radio"
  //             checked={cat === "technology"}
  //             name="cat"
  //             value="technology"
  //             id="technology"
  //             onChange={(e) => setCat(e.target.value)}  // Update category on selection
  //           />
  //           <label htmlFor="technology">Technology</label>
  //         </div>
  //         <div className="cat">
  //           <input
  //             type="radio"
  //             checked={cat === "cinema"}
  //             name="cat"
  //             value="cinema"
  //             id="cinema"
  //             onChange={(e) => setCat(e.target.value)}  // Update category on selection
  //           />
  //           <label htmlFor="cinema">Cinema</label>
  //         </div>
  //         <div className="cat">
  //           <input
  //             type="radio"
  //             checked={cat === "design"}
  //             name="cat"
  //             value="design"
  //             id="design"
  //             onChange={(e) => setCat(e.target.value)}  // Update category on selection
  //           />
  //           <label htmlFor="design">Design</label>
  //         </div>
  //         <div className="cat">
  //           <input
  //             type="radio"
  //             checked={cat === "food"}
  //             name="cat"
  //             value="food"
  //             id="food"
  //             onChange={(e) => setCat(e.target.value)}  // Update category on selection
  //           />
  //           <label htmlFor="food">Food</label>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Enter your title here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
  
        <div className="editorContainer" ref={editorRef}>
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
  
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status:</b> Draft
          </span>
          <span>
            <b>Visibility:</b> Public
          </span>
  
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
  
          <div className="buttons">
            <button>Save as Draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
  
        <div className="item">
          <h1>Category</h1>
          {["art", "science", "technology", "cinema", "design", "food"].map((category) => (
            <div className="cat" key={category}>
              <input
                type="radio"
                id={category}
                name="cat"
                value={category}
                checked={cat === category}
                onChange={(e) => setCat(e.target.value)}
              />
              <label htmlFor={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Write;
