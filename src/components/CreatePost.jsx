import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle the image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Handle creating the post
  const handleCreatePost = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setErrorMessage("You need to be logged in to create a post.");
      return;
    }

    const formData = new FormData();
    formData.append("content", newPostContent);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/posts/create/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to create post");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #141e30, #243b55)",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        animation: "bg-animation 8s infinite alternate",
      }}
    >
      <style>
        {`
          @keyframes bg-animation {
            0% { background: linear-gradient(135deg, #141e30, #243b55); }
            50% { background: linear-gradient(135deg, #243b55, #6a11cb); }
            100% { background: linear-gradient(135deg, #6a11cb, #141e30); }
          }
        `}
      </style>

      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "20px",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.9)",
          background: "linear-gradient(90deg, #ff8a00, #e52e71)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "text-gradient 4s infinite alternate",
        }}
      >
        Create New Post
      </h2>

      {errorMessage && (
        <p
          style={{
            color: "rgba(255, 0, 0, 0.8)",
            fontSize: "1rem",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </p>
      )}

      <textarea
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        placeholder="Write your post..."
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "150px",
          background: "rgba(20, 30, 48, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "8px",
          color: "#ffffff",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "1rem",
          resize: "none",
          outline: "none",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #ff8a00")}
        onBlur={(e) => (e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)")}
      />

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            background: "rgba(36, 59, 85, 0.9)",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "8px",
            outline: "none",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: "1rem",
            transition: "all 0.3s ease-in-out",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
          }}
          onMouseOver={(e) => (e.target.style.border = "1px solid #e52e71")}
          onMouseOut={(e) => (e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)")}
        />
      </div>

      <button
        onClick={handleCreatePost}
        style={{
          background: "linear-gradient(90deg, #e52e71, #ff8a00)",
          color: "#ffffff",
          fontSize: "1rem",
          padding: "10px 20px",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "linear-gradient(90deg, #ff8a00, #e52e71)";
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 8px 20px rgba(229, 46, 113, 0.8)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "linear-gradient(90deg, #e52e71, #ff8a00)";
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
        }}
      >
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;
