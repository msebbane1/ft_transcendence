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
        <Link to="/profile" className="container container-2">
          Profile
        </Link>
        <Link to="/settings" className="container container-3">
          Settings
        </Link>
    </div>
</div>
  );
}

export default Home;

