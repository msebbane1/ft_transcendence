import React from 'react';
import './Home2.css';
import { Link } from 'react-router-dom'; // Importez Link depuis React Router

function Home2() {
  return (
    <div>
      <div className="container-grid">
        <Link to="/play" className="container container-1">
          Play pongGame
        </Link>
        <Link to="/profile" className="container container-1">
          Profile
        </Link>
        <Link to="/chat" className="container container-1">
          Chat
        </Link>
	<Link to="/leaderboard" className="container container-1">
          LeaderBoard
        </Link>
        <Link to="/watch" className="container container-1">
          Watch Game
        </Link>
        <Link to="/settings" className="container container-1">
          Settings
        </Link>
      </div>
    </div>
  );
}

export default Home2;

