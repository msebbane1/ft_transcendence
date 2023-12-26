import React from 'react';
import './Navbar.css';
import { useImageContext } from '../context/ImageContext';

function NavBar() {
const imageProfile = localStorage.getItem('ProfileAvatar'); // recuperer l'img avec useUser
 // const { imageProfile } = useImageContext();
  return (
    <div className="navbar">
     <div>
	  {imageProfile && <img src={imageProfile} alt="Image de profil" style={{
                maxWidth: '30%',
                height: 'auto',
                display: 'block',
                marginTop: '5px',
              }} />}
      </div>
	<div className="nav-links">
	<a href="/play">Game</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
	<a href="/logout">Logout</a>
        </div>
        <div className="text-containerl">
        <p className="text-pongl"> &gt; pong </p>
        <p className="text-gamel"> Game </p>
        </div>
    </div>
  );
}

export default NavBar;

