import React, { useState } from "react";
import { Link } from 'react-router-dom';
import useUser from "../hooks/useUserStorage";
import './TicTacToe.css';

function Square({value, onSquareClick}) {//ancien
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function TicTacToeGame() {
	const user = useUser("user");
	const randomNum = Math.random(); //genere un num entre 0 et 1
    const [xIsNext, setXIsNext] = useState(Math.random() < 0.5);
    const [squares, setSquares] = useState(Array(9).fill(null));
	const [player1, setPlayer1] = useState({

		playerSymbol : (randomNum < 0.5 ? 'X' : 'O'), // si rNum < 0.5 symbole = X et invercement
		playerAlias: user.get("username"),
	});
	const [player2 , setPlayer2] = useState({

		playerSymbol : (player1.playerSymbol === 'X' ? 'O' : 'X'),
		playerAlias : "player 2", //database
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
			{/* recuperer ce que Thomas a fait */}
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

// Module majeur : Ajout d’un second jeu avec historique et "matchmaking".
// Dans ce module majeur, l’objectif est d’introduire un nouveau jeu, distinct de
// Pong, et d’y incorporer des fonctionnalités telles que l’historique de l’utilisateur et
// le "matchmaking".
// ◦ Développez un nouveau jeu pour diversifier l’offre de la plateforme et divertir
// les utilisateurs.
// ◦ Implémentez une gestion de l’historique de l’utilisateur pour enregistrer et afficher les statistiques individuelles du joueur.
// ◦ Créez un système de "matchmaking" pour permettre aux utilisateurs de trouver
// des adversaire afin de disputer des parties équitables et équilibrées.
// ◦ Assurez vous que les données sur l’historique des parties et le "matchmaking"
// sont stockées de manière sécuritaire et demeurent à jour.
// ◦ Optimisez la performance et la réactivité du nouveau jeu afin de fournir une
// expérience utilisateur agréable. Mettez à jour et maintenez régulièrement le jeu
// afin de réparer les bogues, ajouter de nouvelles fonctionnalités et améliorer la
// jouabilité.
// Ce module majeur vise à développer votre plateforme en introduisant un nouveau jeu, améliorant ainsi l’engagement de l’utilisateur avec l’historique des parties,
// et facilitant le "matchmaking" pour une expérience utilisateur agréable.

// matchmaking:

export default TicTacToeGame