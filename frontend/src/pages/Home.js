import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container-home">

    {/*<p className="centered-container">if you want to play with your account you have to create your password game</p>*/}
	   <Link to="/modepong" className="centered-container blinking-text">
          PONGAME
        </Link>
	      {/*<Link to="/modePong" className="container0 container-1">
          Pong
      </Link>*/}
        <Link to="/modetictactoe" className="container0 container-2">
          Tic Tac Toe
        </Link>
        <a href="/profile" className="container0 container-4">
          Profile
        </a>
        <a href="/settings" className="container0 container-5">
          Settings
        </a>
    
</div>
  );
}

export default Home;

