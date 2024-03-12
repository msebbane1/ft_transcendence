import React, {useState} from 'react';
import './modeTicTacToe.css';
import { /*BrowserRouter as Router, Route,*/ Link } from 'react-router-dom';
//page de redirection

function ModeTicTacToe() {

  // États pour stocker les statistiques du joueur //doit provenir de la database
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [gamesLost, setGamesLost] = useState(0);
  const [gamesTied, setGamesTied] = useState(0);

  return (
    <div>
      <div className="mode"> Select Mode</div>
      <div className="linker">
        <Link to="/ai-tictactoe" className="container0 container1">
          <button className="example_g"> Player vs AI</button>
        </Link>
        <Link to="/tictactoe" className="container0 container2">
          <button className="example_g">Player vs Player</button>
        </Link>
        <Link to="/matchmaking" className="container0 container2">
          <button className="example_g">Matchmaking</button>
        </Link>
      </div>
      </div>
    );
}

export default ModeTicTacToe