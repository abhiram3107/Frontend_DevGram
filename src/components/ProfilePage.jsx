import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // For displaying the image
  const [newProfilePicture, setNewProfilePicture] = useState(null); // For uploading a new image
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        navigate("/login"); // Redirect if no token is found
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setBio(response.data.bio); // Set bio data
        setProfilePicture(response.data.profile_picture); // Set profile picture
      } catch (error) {
        setErrorMessage(error.response?.data.detail || "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle bio edit click
  const handleEditBio = () => {
    setIsEditing(true);
  };

  // Handle bio update
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  // Submit the updated bio
  const handleSubmitBio = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setErrorMessage("You need to be logged in to update your bio.");
      return;
    }

    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/profile/edit/",
        { bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to update bio");
    }
  };

  // Handle new profile picture upload
  const handleProfilePictureChange = (e) => {
    setNewProfilePicture(e.target.files[0]); // Set the selected file
  };

  // Submit the updated profile picture
  const handleUploadProfilePicture = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setErrorMessage("You need to be logged in to update your profile picture.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", newProfilePicture);

    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/profile/edit/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile(response.data);
      setProfilePicture(response.data.profile_picture); // Update profile picture in state
      setNewProfilePicture(null); // Reset the file input
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to update profile picture");
    }
  };

  if (!profile) {
    return <CircularProgress color="secondary" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {profile.user.username}'s Profile
      </Typography>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      {/* Profile Section */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: "100%",
          maxWidth: 600,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          {/* Profile Picture */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar
                src={`http://127.0.0.1:8000${profilePicture}`}
                alt="Profile"
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  boxShadow: 2,
                  marginBottom: 2,
                }}
              />
            </motion.div>
            <Tooltip title="Change Profile Picture">
              <IconButton
                color="primary"
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  transform: "translate(25%, 25%)",
                  borderRadius: "50%",
                  padding: 1,
                  boxShadow: 2,
                }}
              >
                <input
                  type="file"
                  onChange={handleProfilePictureChange}
                  hidden
                  accept="image/*"
                  onClick={(e) => e.stopPropagation()}
                />
                <CameraAltIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          {/* Username */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Typography variant="h5">{profile.user.username}</Typography>
          </Grid>

          {/* Bio Section */}
          <Grid item xs={12} display="flex" justifyContent="center">
            {isEditing ? (
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: "100%" }}>
                <TextField
                  value={bio}
                  onChange={handleBioChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                />
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    onClick={handleSubmitBio}
                    sx={{ width: "100%" }}
                  >
                    Save Bio
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    sx={{ width: "100%" }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body1">{profile.bio || "No bio available"}</Typography>
            )}
          </Grid>

          {/* Followers and Following Count */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              <strong>Followers:</strong> {profile.followers_count} |{" "}
              <strong>Following:</strong> {profile.following_count}
            </Typography>
          </Grid>

          {/* Edit Bio Button */}
          {!isEditing && (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button
                variant="outlined"
                onClick={handleEditBio}
                sx={{ marginTop: 2, width: "100%" }}
              >
                Edit Bio
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
