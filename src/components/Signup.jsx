import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { Person, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";  // Import framer-motion for animation

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        password,
      });
      setErrorMessage("");
      navigate("/login"); // Redirect to login after successful signup
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Signup failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: <Person sx={{ marginRight: 1 }} />,
        }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: <Lock sx={{ marginRight: 1 }} />,
        }}
      />

      {/* Animated Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}  // Simple hover scale effect
        whileTap={{ scale: 0.95 }}    // Button click tap effect
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignup}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Signup
        </Button>
      </motion.div>

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#1976d2" }}>
          Login
        </a>
      </Typography>
    </Box>
  );
};

export default Signup;
