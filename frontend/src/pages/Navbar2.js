import React from 'react';
import './Navbar.css';
import { useImageContext } from '../ImageContext';

function NavBar2() {

  const { profileImage } = useImageContext();
  return (
    <div className="navbar">
     <div>
	  {profileImage && <img src={profileImage} alt="Image de profil" style={{
                maxWidth: '30%',
                height: 'auto',
                display: 'block',
                marginTop: '5px',
              }} />}
      </div>
	<div className="nav-links">
	<a href="/watch">WatchGame</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
	<a href="/chat">Chat</a>
      </div>
      <div className="text-containerl">
        <p className="text-pongl"> &gt; pong </p>
        <p className="text-gamel"> Game </p>
      </div>
    </div>
  );
}

export default NavBar2;

