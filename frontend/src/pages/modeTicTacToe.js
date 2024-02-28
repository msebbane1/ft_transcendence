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
          <button class="example_g"> Player vs AI</button>
        </Link>
        <Link to="/tictactoe" className="container0 container2">
          <button class="example_g">Player vs Player</button>
        </Link>
        <Link to="/matchmaking" className="container0 container2">
          <button class="example_g">Matchmaking</button>
        </Link>
      </div>
      <div className='History'>
        <h2>History</h2>
            <div className="row">
                <div className="col-md-4">
                    {/* Contenu du dashboard  modifier pour afficher en forme de doughtnut*/}
                      <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Game played</h5>
                            <p className="card-text">Description de la statistique 1.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    {/* Contenu du dashboard */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Game won</h5>
                            <p className="card-text">Description de la statistique 2.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    {/* Contenu du dashboard */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Lose Game</h5>
                            <p className="card-text">Description de la statistique 3.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    {/* Contenu du dashboard */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Tie Game</h5>
                            <p className="card-text">Description de la statistique 3.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
}

export default ModeTicTacToe