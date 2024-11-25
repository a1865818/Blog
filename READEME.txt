# Web Application README

## Overview

This is a React-based web application that allows users to register, log in, and create or edit blog posts. It is designed using modern web technologies including React, React Router, Axios, and ReactQuill. The app provides a platform where users can write, edit, and delete posts, as well as view individual posts.

## Features

- **User Authentication:**
  - **Register:** Users can register by providing a username, email, and password.
  - **Login:** Registered users can log in to access their profile and create or edit posts.

- **Blog Post Management:**
  - **Create Post:** Authenticated users can create new posts with a title, description, and category.
  - **Edit Post:** Users can edit their existing posts by navigating to the post edit page.
  - **Delete Post:** Users can delete their posts.

- **Rich Text Editor:**
  - The app uses ReactQuill as a WYSIWYG (What You See Is What You Get) rich text editor, allowing users to format their post content easily.

- **Categories:**
  - Posts can be categorized into different sections such as Art, Science, Technology, Cinema, Design, and Food.

- **Responsive Design:**
  - The app is built to be responsive and works on both desktop and mobile devices.

## Tech Stack

- **Frontend:**
  - React.js
  - React Router for routing
  - Axios for API requests
  - ReactQuill for the rich text editor
  - Moment.js for date formatting

- **Backend:**
  - Node.js with Express.
  - RESTful API to handle authentication, post management, and image uploads

- **Styling:**
  - SCSS for styling
  - Custom CSS classes and components for layout and design

## Installation

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate into the project directory:**
   ```bash
   cd <project-directory>
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm start
   ```

   This will start the app on `http://localhost:3000`.

## File Structure

```
/api
    /controllers
        auth.js            - Authentication controller
        posts.js           - Post controller
        user.js            - User controller
    /routes
        auth.js            - Authentication routes
        posts.js           - Post routes
        user.js            - User routes

    db.js                - Database connection
    index.js             - Server 

/client
    /src
    /components
        Navbar.jsx         - Navigation bar component
        Footer.jsx         - Footer component
        Menu.jsx           - Sidebar menu component
    /context
        authContext.js     - Authentication context for managing user state
    /pages
        Home.jsx           - Home page (list of posts)
        Register.jsx       - Register page
        Login.jsx          - Login page
        Write.jsx          - Create or Edit post page
        Single.jsx         - Single post page
    /img
        edit.png           - Image for edit icon
        delete.png         - Image for delete icon
        logo.png           - Logo image
    App.jsx              - Main application component (includes routing logic)
    index.js             - Entry point for React
    style.scss           - Global styles
    ```

## How the App Works

1. **Authentication:**
   - The `AuthContext` component handles the user’s authentication state. It provides `currentUser` to all components via React’s Context API.
   - The `Login` and `Register` pages manage user authentication. Upon successful login or registration, the user is redirected to the home page.

2. **Post Management:**
   - The `Home` page lists all available blog posts.
   - Each post has a title, a short description, and a publication date. Users can click on the title to view the full post.
   - On the `Single` page, users can see the details of a post, and if they are the author of the post, they can edit or delete it.

3. **Creating and Editing Posts:**
   - On the `Write` page, users can create or edit a post.
   - A rich text editor (`ReactQuill`) allows users to add formatted content, images, and more.
   - Users can select a category for the post and upload an image (if editing or creating a new post).

4. **Category Selection:**
   - Users can select one of the predefined categories (Art, Science, Technology, Cinema, Design, Food) when creating or editing a post. This helps to categorize content for easy navigation.

5. **File Upload:**
   - Users can upload an image when creating or editing a post. The file is sent to the server, where it is stored and linked to the post.

6. **Date Formatting:**
   - The `moment.js` library is used to display the post’s creation date in a human-readable format (e.g., "Posted 3 hours ago").

## API Endpoints

The app communicates with an API to handle authentication, posts, and image uploads. The following are the main endpoints:

- **POST `/api/auth/register`**: Register a new user.
- **POST `/api/auth/login`**: Login a user.
- **GET `/api/auth/logout`**: Logout a user.
- **get `/api/auth/google/callback`**: Google OAuth callback route
- **GET `api/google/user`**: Get the Google user information
- **GET `/api/posts/:id`**: Get a specific post by ID.
- **POST `/api/posts/`**: Create a new post.
- **PUT `/api/posts/:id`**: Update an existing post by ID.
- **DELETE `/api/posts/:id`**: Delete a post by ID.
- **POST `/api/upload`**: Upload an image for a post.

