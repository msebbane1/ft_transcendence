import React, { useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import useUser from '../hooks/useUserStorage';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function NavBar() {
  const user = useUser("user");
  const imageProfile = user.get("ProfileAvatar");
  const navigate = useNavigate();

  const fetchProfileImage = async () => {
    const accessToken = user.get("access_token");
    console.log("token NAV:", accessToken);

    if (accessToken && !imageProfile) {
      try {
        const response = await axios.post(
          "https://localhost:8080/api/profileimage/",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const imageUrl = response.data.image_url;
        console.log("image url:", imageUrl);
        user.set("ProfileAvatar", imageUrl);
      } catch (error) {
        console.error("Erreur image", error);
      }
    }
  };
const handleLogout = () => {
    user.clear();
    setTimeout(() => navigate("/"), 500);
  };
  useEffect(() => {
    fetchProfileImage();
  }, [user, imageProfile]);

  return (
    <div className="navbar">
      <div className="text-containerl">
        <p>
          <span className="text-pongl">pong</span>
          <span className="text-gamel">Game</span>
        </p>
      </div>
      <Link to="/home">Home</Link>
      <Link to="/play">Game</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/settings">Settings</Link>
      <a href="/" className="logout-link" onClick={handleLogout}></a>
      <div className="pic-nav">
        {imageProfile && (
          <img src={imageProfile} alt="Image de profil" className="pic-nav" />
        )}
      </div>
    </div>
  );
}

export default NavBar;

