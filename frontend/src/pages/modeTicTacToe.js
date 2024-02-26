import React, {useState} from 'react';
import './modeTicTacToe.css';
import { /*BrowserRouter as Router, Route,*/ Link } from 'react-router-dom';
//page de redirection

function ModeTicTacToe() {
  return (
    <div>
      <div className="mode"> Select Mode</div>
      <div className="linker">
        <Link to="/ai-tictactoe" className="container0 container1">
          <button class="example_g"> Player vs AI</button>
        </Link>
        <Link to="/tictactoe" className="container0 container2">
          <button class="example_g">Player vs Player</button>
        </Link>
      </div>
      <div className='Dashboard'> Affichage du Dashboard du joeur</div>
    </div>
  );
}

export default ModeTicTacToe