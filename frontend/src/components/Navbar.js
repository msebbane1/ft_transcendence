import React, { useEffect, useState} from 'react';
import './Navbar.css';
import useUser from '../hooks/useUserStorage';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import LogoutModals from '../modals/LogoutModals';
import ProfilePictureNav from './ProfilePictureNav';

function NavBar() {
  const user = useUser("user");
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);
  const [profilePictureKey, setProfilePictureKey] = useState(0);
  

  const refreshProfilePicture = () => {
    setProfilePictureKey(prevKey => prevKey + 1);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <nav className="navbar">
      <div className="text-containerl">
        <p>
          <span className="text-pongl">pong</span>
          <span className="text-gamel">Game</span>
        </p>
      </div>
      <Link to="/home">Home</Link>
      <a href="/profile">Profile</a> 
      <a href="/settings">Settings</a>
      <div className="logout-link" onClick={openModal}></div>
      <div className="img-fluid">
        < ProfilePictureNav key={profilePictureKey} refreshImage={refreshProfilePicture}/>
	  {/*<div className="status-indicator"></div>*/}
      </div>
     <LogoutModals showModal={showModal} handleClose={closeModal} />
    </nav>
  );
}

export default NavBar;

