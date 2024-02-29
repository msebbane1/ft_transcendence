import React, { useState } from "react";
import { Link  } from 'react-router-dom';
import useUser from "../hooks/useUserStorage";
import axios from 'axios';
import './TicTacToe.css';

function Square({value, onSquareClick}) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function TicTacToeGame() {
	const user = useUser("user");
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const randomNum = Math.random(); //genere un num entre 0 et 1
    const [xIsNext, setXIsNext] = useState(Math.random() < 0.5);
    const [squares, setSquares] = useState(Array(9).fill(null));
	const [player1, setPlayer1] = useState({

		playerSymbol : (randomNum < 0.5 ? 'X' : 'O'), // si rNum < 0.5 symbole = X et invercement
		playerAlias: user.get("username"),
	});
	const [player2 , setPlayer2] = useState({

		playerSymbol : (player1.playerSymbol === 'X' ? 'O' : 'X'),
		playerAlias : "", //database
	});
	
	const handleRefresh = () => {
        window.location.href = "/ai-tictactoe"; 
        window.location.reload();
    }

	const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

	const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('username:', username);
		console.log('password:', password);
        try {
			const response = await axios.post('https://localhost:8080/api/signin/', {
			  username,
			  password,
			});
	  
			const data = response.data;
	  
			setUsername('');
			setPassword('');
		  } catch (error) {
            console.error('Error:', error);
        }
		player2.playerAlias = username;
    };

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
		}
		else if(winner === player2.playerSymbol){
			status = `Winner : ${player2.playerAlias}`;
		}
	} else {
		if(tie){
			status = "It's a Tie!";
		} else{
			nextPlayer = `Next player: ${xIsNext ? player1.playerAlias : player2.playerAlias}`;
		}
	}

    return(
        <>
			{ player2.playerAlias === "" && (
				<div className="pop-up-overlay">
					<div className="pop-up">
						<div className="alert alert-info" role="alert">
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
								<input type="text" className="form-control" id="exampleFormControlInput1" placeholder="example: John" value={username} onChange={handleUsernameChange} />
							</div>
							<div className="mb-3">
								<label htmlFor="inputPassword5" className="form-label">Password</label>
								<input type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock" value={password} onChange={handlePasswordChange} />
								<div id="passwordHelpBlock" className="form-text">
									Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
								</div>
							</div>
							<button type="submit" className="btn btn-primary">Submit</button>
						</form>
						</div>
					</div>
				</div>
			)}
			{(winner || tie) && (
                <div className="popup-container">
                    <div className="popup">
                        <div className="alert alert-success" role="alert">
                            <h4 className={`status ${winner ? 'winner' : ''} ${tie ? 'tie' : ''}`}>{status}</h4>
                            <div className="linker">
                                <Link to="/ai-tictactoe">
                                    <button type="button" class="btn btn-secondary" onClick={() => handleRefresh()}>Play Again</button>
                                </Link>
                                <Link to="/modetictactoe">
                                    <button type="button" class="btn btn-secondary">Change Mode</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
			{/* garder l'affichage du next player ?*/}
			<div className="board">
				{ nextPlayer && (
					<div className="next-player-container">
						<div className={`nextplayer ${xIsNext ? player1.playerAlias : player2.playerAlias}`}>
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

export default TicTacToeGame