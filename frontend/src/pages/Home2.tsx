import React from 'react';
import './Home2.css';
import { Link } from 'react-router-dom'; // Importez Link depuis React Router

function Home2() {
  return (
    <div>
     <div>
	<Link to="/play" className="centered-container blinking-text">
          PLAY
        </Link>
      </div>
      <div className="container-grid">
        <Link to="/leaderboard" className="container container-1">
          Leader
	  Board
        </Link>
        <Link to="/watch" className="container container-2">
          Watch Game
        </Link>
        <Link to="/chat" className="container container-3">
          Chat
        </Link>
    </div>
</div>
  );
}

export default Home2;

