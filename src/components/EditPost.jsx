import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

const EditPost = () => {
  const { postId } = useParams(); // Get the post ID from the URL
  const [editingPostContent, setEditingPostContent] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/posts/${postId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditingPostContent(response.data.content);
      } catch (error) {
        console.error("Failed to fetch post for editing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const handleEditPost = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("You need to be logged in to edit a post.");
      return;
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/posts/${postId}/edit/`,
        { content: editingPostContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/home"); // Redirect back to home after editing the post
    } catch (error) {
      console.error("Failed to update post:", error.response?.data?.detail || error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
        padding: 2,
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", maxWidth: "600px" }}
        >
          <Card sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
              Edit Post
            </Typography>
            <TextField
              value={editingPostContent}
              onChange={(e) => setEditingPostContent(e.target.value)}
              placeholder="Edit your post..."
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              sx={{ marginBottom: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditPost}
              fullWidth
            >
              Update Post
            </Button>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default EditPost;
