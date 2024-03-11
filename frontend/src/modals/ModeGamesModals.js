import React from 'react';
import { Link } from 'react-router-dom';
import "./ModeGamesModals.css";

function ModeGamesModals({ showModal, handleClose }) {
    return (
      <div className={`modalGames ${showModal ? 'showGames' : ''}`} onClick={handleClose}>
        <div className="modal-content-Games" onClick={(e) => e.stopPropagation()}>
          <p className='game-title'>Choose a Game</p>
          <div className="game-options">
            <Link to="/modepong" className="container-1Games"></Link>
            <p className='game-title'>or</p>
            <Link to="/modetictactoe" className="container-2Games"></Link>
            
          </div>
        </div>
      </div>
    );
  }
  
  export default ModeGamesModals;