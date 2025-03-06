import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Card, CardContent, IconButton, Alert, CircularProgress, Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

const CommentsPage = () => {
  const { postId } = useParams(); // Get the postId from URL
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}/comment/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data.detail || "Failed to fetch comments.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchComments();
  }, [postId, navigate]);

  // Handle submitting new comment
  const handleAddComment = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setErrorMessage("You need to be logged in to add a comment.");
      return;
    }

    if (newComment.trim() === "") {
      setErrorMessage("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/posts/${postId}/comment/`, // Correct endpoint for posting a comment
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]); // Add the new comment to the list
      setNewComment(""); // Reset comment input
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to add comment.");
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("access");

    if (!token) {
      setErrorMessage("You need to be logged in to delete a comment.");
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/posts/${postId}/comment/${commentId}/`, // Delete endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove deleted comment from the list
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to delete comment.");
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
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom>
          Comments
        </Typography>
      </motion.div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <Card sx={{ padding: 2, marginBottom: 2, width: "100%" }}>
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            fullWidth
          >
            Post Comment
          </Button>
        </Card>
      </motion.div>

      {loading ? (
        <CircularProgress />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%", maxWidth: "600px" }}
        >
          <Typography variant="h5" gutterBottom>
            All Comments
          </Typography>
          {comments.length === 0 ? (
            <Typography>No comments yet.</Typography>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: "1rem" }}
              >
                <Card sx={{ padding: 2, display: "flex", alignItems: "center" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" color="primary">
                      {comment.author.username}
                    </Typography>
                    <Typography variant="body2">{comment.content}</Typography>
                  </CardContent>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Delete />
                  </IconButton>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </Box>
  );
};

export default CommentsPage;
