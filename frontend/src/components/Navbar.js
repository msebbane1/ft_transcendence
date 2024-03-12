import React, { useEffect, useState} from 'react';
import './Navbar.css';
import useUser from '../hooks/useUserStorage';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import LogoutModals from '../modals/LogoutModals';

function NavBar() {
  const user = useUser("user");
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);


  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <nav className="navbar">
      <div className="text-containerl">
      <p>
        <Link to="/home"> 
          <span className="text-pongl">pong</span>
        </Link>
        <Link to="/home">
          <span className="text-gamel">Game</span>
        </Link>
      </p>
      </div>
      <Link to="/home">Home</Link>
      <a href="/profile">Profile</a> 
      <a href="/settings">Settings</a>
      <div className="logout-link" onClick={openModal}></div>
     <LogoutModals showModal={showModal} handleClose={closeModal} />
    </nav>
  );
}

export default NavBar;

