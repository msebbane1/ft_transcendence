import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div class="container-home">
	{/* <Link to="/play" className="centered-container blinking-text">
          PLAY
        </Link> */}
        <Link to="/play" className="container0 container-1">
          Pong
        </Link>
        <Link to="/modetictactoe" className="container0 container-2">
          TicTacToe
        </Link>
        <Link to="/leaderboard" className="container0 container-3">
          Leader
	  Board
        </Link>
        <Link to="/profile" className="container0 container-4">
          Profile
        </Link>
        <Link to="/settings" className="container0 container-5">
          Settings
        </Link>
    
</div>
  );
}

export default Home;

