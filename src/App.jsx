import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";  // Import the CreatePost page
import EditPost from "./components/EditPost";  // Import the EditPost page
import MyPosts from "./components/MyPosts";
import Profile from "./components/ProfilePage";
import UserProfile from "./components/UserProfile";
import CommentsPage from "./components/Comments";

const App = () => {
  const [token, setToken] = useState(null);

  const handleLogin = (token) => {
    setToken(token); // Set the token after successful login
  };

  const handleLogout = () => {
    setToken(null); // Clear the token
  };

  return (
    <Router>
      <div>
        <h1>Dev Connect App</h1>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path="/home"
            element={<Home onLogout={handleLogout} />}
          />
          {/* Add routes for CreatePost and EditPost */}
          <Route
            path="/create-post"
            element={<CreatePost />} // Route for creating new post
          />
          <Route
            path="/edit-post/:postId"
            element={<EditPost />} // Route for editing an existing post
          />
          <Route path="/my-posts" element={<MyPosts />} /> {/* Add route for MyPosts */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/comments/:postId" element={<CommentsPage />} />
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;
