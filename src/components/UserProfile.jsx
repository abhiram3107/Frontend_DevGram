import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';

// Styled components for the UserProfile
const UserProfileContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const UserProfile = () => {
  const { userId } = useParams(); // Extract userId from URL
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user profile
        const response = await axios.get(`http://127.0.0.1:8000/api/profile/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);

        // Check follow status
        const followResponse = await axios.get(
          `http://127.0.0.1:8000/api/follow/${userId}/status/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(followResponse.data.is_following);
      } catch (error) {
        setErrorMessage(error.response?.data.detail || "Failed to fetch profile");
      }
    };

    fetchUserProfile();
  }, [userId, navigate]);

  const handleFollow = async () => {
    const token = localStorage.getItem("access");
    try {
      await axios.post(`http://127.0.0.1:8000/api/follow/${userId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(true);
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to follow user");
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem("access");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/unfollow/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(false);
    } catch (error) {
      setErrorMessage(error.response?.data.detail || "Failed to unfollow user");
    }
  };

  return (
    <UserProfileContainer>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {userProfile ? (
        <div>
          <Title>{userProfile.user.username}'s Profile</Title>
          <Text>Bio: {userProfile.bio}</Text>
          <Text>Followers: {userProfile.followers_count}</Text>
          <Text>Following: {userProfile.following_count}</Text>
          <Button onClick={isFollowing ? handleUnfollow : handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
      ) : (
        <Text>Loading...</Text>
      )}
    </UserProfileContainer>
  );
};

export default UserProfile;
