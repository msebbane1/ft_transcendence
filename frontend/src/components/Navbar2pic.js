import React, { useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import useUser from '../hooks/useUserStorage';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import LogoutModals from '../modals/LogoutModals';

function NavBar() {
  const user = useUser("user");
  const imageProfile = user.get("ProfileAvatar");
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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

  useEffect(() => {
    fetchProfileImage();
  }, [user, imageProfile]);

  return (
    <nav className="navbar">
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
      <div className="logout-link" onClick={openModal}></div>
      <div class="img-fluid">
        {imageProfile ? (
          <img src={imageProfile} alt="Image de profil" className="rounded-circle pic-nav" />
        ) : (
          <div className="default-avatar-nav"></div>
        )}
	<div className="status-indicator"></div>
      </div>
     <LogoutModals showModal={showModal} handleClose={closeModal} />
    </nav>
  );
}

export default NavBar;

