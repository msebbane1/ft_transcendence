import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
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

export default Home;

