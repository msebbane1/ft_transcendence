import React, { useState, useEffect } from "react";
import { Link  } from 'react-router-dom';
import axios from 'axios';

var winningPlayer = "";

function Square({value, onSquareClick}) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function ShowTicTacToe(user, opponent){

    //const user = useUser("user");
	const randomNum = Math.random(); //genere un num entre 0 et 1
    const [xIsNext, setXIsNext] = useState(Math.random() < 0.5);
    const [squares, setSquares] = useState(Array(9).fill(null));
	const [player1, setPlayer1] = useState({

		playerSymbol : (randomNum < 0.5 ? 'X' : 'O'), // si rNum < 0.5 symbole = X et invercement
		playerAlias: user,
	});
	const [player2 , setPlayer2] = useState({

		playerSymbol : (player1.playerSymbol === 'X' ? 'O' : 'X'),
		playerAlias : opponent,
	});
	
	const handleRefresh = () => {
        window.location.href = "/ai-tictactoe"; 
        window.location.reload();
    }

    function handleClick(i){
		if ( calculateWinner(squares) || squares[i]) {
			return;
		}
        const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = xIsNext ? player1.playerSymbol : player2.playerSymbol;;
		} else {
			nextSquares[i] = xIsNext ? player1.playerSymbol : player2.playerSymbol;;
		}
        setSquares(nextSquares);
		setXIsNext(!xIsNext);
    }

	function checkBoardFull(){

		return squares.every(square => square !== null);
	}

	const winner = calculateWinner(squares);
	const tie = checkBoardFull() && !winner;
	let status;
	let nextPlayer;
	if (winner) {
		if(winner === player1.playerSymbol){
			status = `Winner : ${player1.playerAlias}`;
			winningPlayer = player1.playerAlias;
		}
		else if(winner === player2.playerSymbol){
			status = `Winner : ${opponent}`;
			winningPlayer = opponent;
		}
	} else {
		if(tie){
			status = "It's a Tie!";
			winningPlayer = "draw";
		} else{
			nextPlayer = `Next player: ${xIsNext ? player1.playerAlias : opponent}`;
		}
	}

	 //fonction pour communiquer aux back les infos de partie 
	 useEffect(() => {
		let p2State = "User";
		let p1 = player1.playerAlias;
		let p2 = opponent;
		let gameState = winningPlayer;
        if(winningPlayer != ""){
            axios.post('https://localhost:8080/api/ttthistory/', {
				p1,
				p2,
				p2State,
				gameState,
				winningPlayer,
            })
            .then(response => {
                const data = response.data;
				winningPlayer = "";
				//setMatchUp(false);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    alert(error.response.data.error); // Affiche le message d'erreur renvoyé par le backend
                } else {
                    alert("An error occurred while processing your request.");
                }});
        }
    }, [winningPlayer]);

    return(
        <>
			{(winner || tie) && (
                <div className="popup-container">
                    <div className="popup">
                        <div className="alert alert-success" role="alert">
                            <h4 className={`status ${winner ? 'winner' : ''} ${tie ? 'tie' : ''}`}>{status}</h4>
                            <div className="linker">
                                <Link to="/ai-tictactoe">
                                    <button type="button" className="btn btn-secondary" onClick={() => handleRefresh()}>Play Again</button>
                                </Link>
                                <Link to="/modetictactoe">
                                    <button type="button" className="btn btn-secondary">Change Mode</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
			<div className="board">
				{ nextPlayer && (
					<div className="next-player-container">
						<div className={`nextplayer ${xIsNext ? player1.playerAlias : opponent}`}>
							{nextPlayer}
						</div>
					</div>
				)}
				<div className="board-row">
					<Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
					<Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
					<Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
				</div>
				<div className="board-row">
					<Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
					<Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
					<Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
				</div>
				<div className="board-row">
					<Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
					<Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
					<Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
				</div>
			</div>		
        </>
    );
}

function calculateWinner(squares) { 
	const lines = [// combinaison gagnante
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++){
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
			return squares[a];
		}
	}
	return null;
}

export default ShowTicTacToe;