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
      <div className='Dashboard'>
        <h2>Dashboard</h2>
            <div className="row">
                <div className="col-md-4">
                    {/* Contenu du dashboard */}
                      <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Statistique 1</h5>
                            <p className="card-text">Description de la statistique 1.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    {/* Contenu du dashboard */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Statistique 2</h5>
                            <p className="card-text">Description de la statistique 2.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    {/* Contenu du dashboard */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Statistique 3</h5>
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