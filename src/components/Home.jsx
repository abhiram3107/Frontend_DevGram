import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box, Card, CardContent, CardActions, IconButton, Alert, Container } from "@mui/material";
import { ThumbUp, Comment, Edit, Delete } from "@mui/icons-material";

const Home = ({ onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null); // State for logged-in user info
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }

      try {
        // Fetch user information and posts in parallel
        const [postsResponse, userResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/posts/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/user/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPosts(postsResponse.data);
        setUser(userResponse.data);
      } catch (error) {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem("refresh");
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post(
                "http://127.0.0.1:8000/api/token/refresh/",
                { refresh: refreshToken }
              );
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem("access", newAccessToken);
              const retryResponse = await axios.get("http://127.0.0.1:8000/api/posts/", {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });
              setPosts(retryResponse.data);
            } catch (refreshError) {
              setErrorMessage("Session expired, please log in again.");
              navigate("/login");
            }
          } else {
            setErrorMessage("Please log in again.");
            navigate("/login");
          }
        } else {
          setErrorMessage(error.response?.data.detail || "Failed to fetch posts");
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  // Toggle Like Status (handle both Like and Unlike)
  const handleToggleLike = async (postId, isLiked) => {
    const token = localStorage.getItem("access");
    if (!token) {
      setErrorMessage("You need to be logged in to like/unlike a post.");
      return;
    }

    try {
      const response = isLiked
        ? await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes_count: response.data.likes_count, is_liked: !isLiked } // Toggle like status
            : post
        )
      );
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to toggle like");
    }
  };

  // Navigate to Create Post Page
  const handleCreatePostRedirect = () => {
    navigate("/create-post");
  };

  // Navigate to Edit Post Page
  const handleEditPostRedirect = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  // Delete Post
  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("access");
    if (!token) {
      setErrorMessage("You need to be logged in to delete a post.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId)); // Remove post from the list
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to delete post");
    }
  };

  // Navigate to comment page for a specific post
  const handleGoToComments = (postId) => {
    navigate(`/comments/${postId}`);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome!
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
          <Button color="inherit" onClick={handleCreatePostRedirect}>
            Create Post
          </Button>
          <Button color="inherit" onClick={() => navigate("/my-posts")}>
            My Posts
          </Button>
          <Button color="inherit" onClick={() => navigate("/profile")}>
            Profile
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content Box */}
      <Container sx={{ paddingTop: 3, flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          Welcome {user ? user.username : "User"}!
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Typography variant="h5" gutterBottom>
          Posts
        </Typography>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <Card key={post.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  onClick={() => navigate(`/profile/${post.author.id}`)}
                  sx={{ cursor: "pointer", color: "blue" }}
                >
                  {post.author.username}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  {post.content}
                </Typography>
                {post.image && (
                  <Box sx={{ marginTop: 2 }}>
                    <img
                      src={`http://127.0.0.1:8000${post.image}`}
                      alt="Post Image"
                      style={{ width: "30%", height: "auto", objectFit: "cover" }}
                    />
                  </Box>
                )}
                <Typography variant="body2" sx={{ color: "gray", marginTop: 1 }}>
                  Likes: {post.likes_count} | Comments: {post.comments_count}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  onClick={() => handleToggleLike(post.id, post.is_liked)}
                >
                  <ThumbUp />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleGoToComments(post.id)}>
                  <Comment />
                </IconButton>
                {user && user.id === post.author.id && (
                  <>
                    <IconButton onClick={() => handleEditPostRedirect(post.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePost(post.id)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
};

export default Home;
