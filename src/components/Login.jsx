import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { Person, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";  // Import framer-motion for animation

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send login request
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      // Assuming the response includes user details
      const { access, refresh, user } = response.data;

      // Store the tokens and username in localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("username", user.username);  // Store the username

      // Call the onLogin function to update the app state if needed
      onLogin(access);

      // Redirect to home page
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Login failed");
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
        Login
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
          onClick={handleLogin}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
      </motion.div>

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Don't have an account?{" "}
        <a href="/signup" style={{ color: "#1976d2" }}>
          Sign up
        </a>
      </Typography>
    </Box>
  );
};

export default Login;
