import React from 'react';
import './Navbar.css';

function NavBar2() {
  return (
    <div className="navbar">
     <div className="pic-profile">
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

