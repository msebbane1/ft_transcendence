import React from 'react';
import './modePong.css';
import { Link } from 'react-router-dom';

function ModePong() {
  return (
    <div>
      <div className="mode"> Select Mode</div>
      <div className="linker">
        <Link to="/ia-pong" className="container0 container1">
          <button className="example_g"> Player vs AI</button>
        </Link>
        <div className="button-container">
          <Link to="/login2p" className="container0 container2">
            <button className="example_g">Player vs Player</button>
          </Link>
          <Link to="/tournament" className="container0 container4">
            <button className="example_g large">Tournament</button>
          </Link>
        </div>
        <Link to="/login3p" className="container0 container3">
          <button className="example_g">3 Players</button>
        </Link>
      </div>
    </div>
  );
}

export default ModePong;
