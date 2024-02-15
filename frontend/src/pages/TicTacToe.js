import React, { useState } from "react";
import './TicTacToe.css';

function Square({value, onSquareClick}) {//ancien
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function TicTacToeGame() {
	const randomNum = Math.random(); //genere un num entre 0 et 1
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
	const [player1, setPlayer1] = useState({

		playerSymbol : (randomNum < 0.5 ? 'X' : 'O'), // si rNum < 0.5 symbole = X et invercement
		//playerId : , //database
	});
	const [player2 , setPlayer2] = useState({

		playerSymbol : (player1.playerSymbol === 'X' ? 'O' : 'X'),
		//playerId : , //database
	});
	

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
	if (winner) {
		status = `Winner : ${winner}`;
	} else {
		if(tie){
			status = "It's a Tie!";
		} else{
			status = `Next player: ${xIsNext ? player1.playerSymbol : player2.playerSymbol}`;
		}
	}

    return(
        <>
			<div className={`status ${winner ? 'winner' : ''} ${tie ? 'tie' : ''}`}>
    			{status}
			</div>
			<div className="board">
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

export default TicTacToeGame