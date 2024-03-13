import React, { useState } from "react";
import { useEffect } from "react";
//import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useUser from "../hooks/useUserStorage";
import axios from 'axios';
import "./AI_TicTacToe.css"

var winningPlayer = "";

function Square({value, onSquareClick}) {//ancien
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function AITicTacToe(){
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
	const randomNum = Math.random(); //genere un num entre 0 et 1
    const [xIsNext, setXIsNext] = useState(true);
    const user = useUser("user");
    const p1 = user.get('pseudo');
    const [squares, setSquares] = useState(Array(9).fill(null));
	const [player, setPlayer] = useState({
        playerSymbol: (randomNum < 0.5 ? 'X' : 'O'),  // si rNum < 0.5 symbole = X et invercement
    });
	const [ai , setAi] = useState({
        aiSymbol: (player.playerSymbol === 'X' ? 'O' : 'X'), //choisi en fonction du symbole du player
        aiAlias: "AI",
    });

    const handleRefresh = () => {
        window.location.href = "/ai-tictactoe"; 
        window.location.reload();
    }

    useEffect(() => {
        if (!xIsNext && !calculateWinner(squares, lines)) {
                const aiMove = AI(squares); // Récupère le mouvement de l'IA
                const nextSquares = squares.slice();// l'utilisation de slice() permet de creer une copie du jeu a modifier pour garder le status d'avant en memoire
                nextSquares[aiMove] = ai.aiSymbol;
                setSquares(nextSquares);
                setXIsNext(true);
        }
    }, [xIsNext, squares, ai.aiSymbol]);

    function handleClick(i) {
        if (calculateWinner(squares, lines) || squares[i]) {
            return;
        }
        if(xIsNext){
			const nextSquares = squares.slice();
			nextSquares[i] = xIsNext ? player.playerSymbol : ai.aiSymbol;
			setSquares(nextSquares);
        }
        setXIsNext(!xIsNext);
    }

	function checkBoardFull(){

		return squares.every(square => square !== null);
	}

	function calculateWinner(squares, lines) { 
	
		for (let i = 0; i < lines.length; i++){
			const [a, b, c] = lines[i];
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
				return squares[a];
			}
		}
		return null;
	}
    
	const winner = calculateWinner(squares, lines);
	const tie = checkBoardFull() && !winner;
	let status;
	if (winner) {
        if(winner === ai.aiSymbol){
            status = "AI wins!";
            winningPlayer = "IA";
        }
        else if (winner === player.playerSymbol){
            status = "You win!";
            winningPlayer = p1;
        }
	} else {
        if(tie){
            status = "It's a Tie!";
            winningPlayer = "draw";
		} else {
            status = `Next player: ${xIsNext ? player.playerSymbol : ai.aiSymbol}`;
		}
	}
    
    function chooseCase(emptySquares){ //fonction qui choisie quel coup l'IA doit jouer

        for(let i = 0; i < lines.length; i++){ // donne la priorité a l'IA pour gagner
            let aiCount = 0;
            let playerCount = 0;
            let emptyCount = 0;
            let emptyIndices = 0;
            let line = lines[i];
            for(let y = 0; y < line.length; y++){
                if(squares[line[y]] === ai.aiSymbol){
                    aiCount++;
                } else if (squares[line[y]] === player.playerSymbol){
                    playerCount++;
                } else{
                    emptyCount++;
                    emptyIndices = line[y];
                }
            }
            if(aiCount === 2 && emptyCount === 1){
                return emptyIndices;
            }
        }

        for(let i = 0; i < lines.length; i++){
            let aiCount = 0;
            let playerCount = 0;
            let emptyCount = 0;
            let emptyIndices = 0;
            let line = lines[i];
            for(let y = 0; y < line.length; y++){
                if(squares[line[y]] === ai.aiSymbol){
                    aiCount++;
                } else if (squares[line[y]] === player.playerSymbol){
                    playerCount++;
                } else{
                    emptyCount++;
                    emptyIndices = line[y];
                }
            }
           if(playerCount === 2 && emptyCount === 1){
                return emptyIndices;
            }
        }
    
        // Si aucune combinaison gagnante pour le joueur, jouer un coup aléatoire
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        return emptySquares[randomIndex];
    }


    useEffect(() => {
        let p2State = "IA";
        let p2 = "IA";
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

    function AI(squares) { //faire une IA defensive 
        const emptySquares = squares.reduce((acc, curr, index) => {  
            if (curr === null) {
                acc.push(index); // push dans acc qui remplira emptySquares
            }
            return acc;
        }, []);
        const index = chooseCase(emptySquares, squares);
        return index;
    }


    return (
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
                <div className="board-row">
                    {[0, 1, 2].map(i => (
                        <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
                    ))}
                </div>
                <div className="board-row">
                    {[3, 4, 5].map(i => (
                        <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
                    ))}
                </div>
                <div className="board-row">
                    {[6, 7, 8].map(i => (
                        <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default AITicTacToe