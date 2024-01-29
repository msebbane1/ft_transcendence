import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div class="container-home">
	<Link to="/play" className="centered-container blinking-text">
          PLAY
        </Link>
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
  );
}

export default Home;

