import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import { Edit, Delete, Comment } from "@mui/icons-material";
import { motion } from "framer-motion";

const MyPosts = () => {
  const [posts, setPosts] = useState([]); // State for posts
  const [user, setUser] = useState(null); // State for logged-in user info
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }

      try {
        // Fetch the user information
        const userResponse = await axios.get("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data); // Set the user state

        // Fetch posts by the logged-in user
        const response = await axios.get("http://127.0.0.1:8000/api/user/posts/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data); // Set the posts data
      } catch (error) {
        console.error("Failed to fetch posts:", error.response?.data?.detail || error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  // Handle navigation actions
  const handleGoToComments = (postId) => navigate(`/comments/${postId}`);
  const handleEditPostRedirect = (postId) => navigate(`/edit-post/${postId}`);

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("You need to be logged in to delete a post.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId)); // Remove post from the list
    } catch (error) {
      console.error("Failed to delete post:", error.response?.data?.detail || error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #141e30, #243b55)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        color: "#FFFFFF",
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", marginBottom: 4 }}>
        My Posts
      </Typography>

      {loading ? (
        <CircularProgress color="secondary" />
      ) : posts.length === 0 ? (
        <Typography variant="h6" sx={{ color: "#BBBBBB" }}>
          No posts available.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 4,
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                  borderRadius: 3,
                  overflow: "hidden",
                  color: "#FFFFFF",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                {/* Image section */}
                {post.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={`http://127.0.0.1:8000${post.image}`}
                    alt="Post image"
                    sx={{
                      objectFit: "cover",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  />
                )}

                {/* Post Content */}
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#FFD700" }}
                  >
                    {post.author.username}
                  </Typography>
                  <Typography variant="body1">{post.content}</Typography>
                  <Typography variant="body2" sx={{ color: "#CCCCCC", marginTop: 1 }}>
                    Likes: {post.likes_count} | Comments: {post.comments_count}
                  </Typography>
                </CardContent>

                {/* Actions */}
                <CardActions disableSpacing>
                  {user && user.id === post.author.id && (
                    <>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleEditPostRedirect(post.id)}
                        sx={{ "&:hover": { color: "#FFD700" } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDeletePost(post.id)}
                        sx={{ "&:hover": { color: "#FF6347" } }}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    aria-label="comments"
                    color="secondary"
                    onClick={() => handleGoToComments(post.id)}
                    sx={{ "&:hover": { color: "#87CEFA" } }}
                  >
                    <Comment />
                  </IconButton>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyPosts;
