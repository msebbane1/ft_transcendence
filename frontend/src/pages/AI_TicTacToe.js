import React, { useState } from "react";
import { useEffect } from "react";
import "./AI_TicTacToe.css"

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
    const [squares, setSquares] = useState(Array(9).fill(null));
	const [player, setPlayer] = useState({
        playerSymbol: (randomNum < 0.5 ? 'X' : 'O'),  // si rNum < 0.5 symbole = X et invercement
        //playerId: , //database
    });
	const [aiSymbol , setAi] = useState(player.playerSymbol === 'X' ? 'O' : 'X'); //choisi en fonction du symbole du player
	
    useEffect(() => { //rendre l'IA intelligente (verifier les diagonales/lignes droites et faire un algo de defenese ou d'attaque)
        if (!xIsNext && !calculateWinner(squares, lines)) {
                const aiMove = AI(squares); // Récupère le mouvement de l'IA
                console.log("aiMove=", aiMove);
                const nextSquares = squares.slice();// l'utilisation de slice() permet de creer une copie du jeu a modifier pour garder le status d'avant en memoire
                nextSquares[aiMove] = aiSymbol;
                setSquares(nextSquares);
                setXIsNext(true);
        }
    }, [xIsNext, squares, aiSymbol]);

    function handleClick(i) {
        if (calculateWinner(squares, lines) || squares[i]) {
            return;
        }
        if(xIsNext){
			const nextSquares = squares.slice();
			nextSquares[i] = xIsNext ? player.playerSymbol : aiSymbol;
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
        status = `Winner : ${winner}`;
	} else {
        if(tie){
            status = "It's a Tie!";
		} else {
            status = `Next player: ${xIsNext ? player.playerSymbol : aiSymbol}`;
		}
	}
    
    function chooseCase(emptySquares){ //fonction qui choisie quel coup l'IA doit jouer

        for(let i = 0; i < lines.length; i++){
            let aiCount = 0;
            let playerCount = 0;
            let emptyCount = 0;
            let emptyIndices = 0;
            let line = lines[i];
            for(let y = 0; y < line.length; y++){
                if(squares[line[y]] === aiSymbol){
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
            } else if(playerCount === 2 && emptyCount === 1){
                return emptyIndices;
            }
        }
    
        // Si aucune combinaison gagnante pour le joueur, jouer un coup aléatoire
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        return randomIndex;
    }

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

    return ( //modifer status en fenetre pop-up pour winner ou Tie Game; lien util: https://popupsmart.com/blog/react-popup
        <>
        	<div className={`status ${winner ? 'winner' : ''} ${tie ? 'tie' : ''}`}>
                {status}
            </div>
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
            <div className="resetgame">
                <button className="reset-button">Reset{/*changer reset-button en pop-up (rejouer une partie ou changer de jeu)*/}</button>
            </div>
        </>
    );
}

export default AITicTacToe