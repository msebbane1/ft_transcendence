import React, { useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import useUser from '../hooks/useUserStorage';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <nav className="navbar navbar-expand-lg navbar-light navbar">
      <div className="container-fluid">
        <div className="text-containerl">
          <p>
            <span className="text-pongl">pong</span>
            <span className="text-gamel">Game</span>
          </p>
        </div>
        <div className="navbar-nav">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/play" className="nav-link">Game</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
        </div>
        <a href="/" className="logout-link" onClick={handleLogout}></a>
        <div className="pic-nav">
          {imageProfile && (
            <img src={imageProfile} alt="Image de profil" className="pic-nav" />
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

