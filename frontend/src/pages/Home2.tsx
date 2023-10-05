import React from 'react';
import './Home2.css';
import { Link } from 'react-router-dom'; // Importez Link depuis React Router

function Home2() {
  return (
    <div>
      <h1>Transcendence</h1>
      <p>TEEEEST HOME</p>
      <div className="container-grid">
        <Link to="/play" className="container container-1">
          Play pongGame
        </Link>
        <Link to="/profile" className="container container-2">
          Profile
        </Link>
        <Link to="/chat" className="container container-3">
          Chat
        </Link>
	<Link to="/leaderboard" className="container container-4">
          LeaderBoard
        </Link>
        <Link to="/watch" className="container container-5">
          Watch Game
        </Link>
        <Link to="/settings" className="container container-6">
          Settings
        </Link>
      </div>
    </div>
  );
}

export default Home2;

