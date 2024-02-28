import React, { useState } from "react";
//import { Link  } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';
import useUser from "../hooks/useUserStorage";
import axios from 'axios';
import './matchmakingTicTacToe.css';

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

// matchmaking: se baser sur le nombre de partie gagner / perdu et tie

function Matchmaking(){

    const [isInQueue, setIsInQueue] = useState(false);
    const user = useUser("user");
    // const [username, setUsername] = useState('');//recuperer le username en entrer
	// const [password, setPassword] = useState('');//recuperer le mot de passe en entrer
    const [waitingPlayer, setWaitingPLayer] = useState({
        players: [{
            alias: '',
            winrate: '', //database
            waitingTime: 0, //clock
        }], //nom; winrate, time
    });

    // const handleUsernameChange = (event) => {
    //     setUsername(event.target.value);
    // };

    // const handlePasswordChange = (event) => {
    //     setPassword(event.target.value);
    // };

	// const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log('username:', username);
	// 	console.log('password:', password);
    //     try {
	// 		const response = await axios.post('https://localhost:8080/api/signin/', {
	// 		  username,
	// 		  password,
	// 		});
	  
	// 		const data = response.data;
	  
	// 		setUsername('');
	// 		setPassword('');
	// 	  } catch (error) {
    //         console.error('Error:', error);
    //     }
	// 	waitingPlayer.playerAlias = username;
    // };

     // Fonction pour rejoindre la file d'attente de matchmaking
    const joinMatchmakingQueue = async () => {
        try {
            //if (waitingPlayer.player && waitingPlayer.player.length > 0) {
                const len = waitingPlayer.players.length;
                if(user && len > 0){
                    waitingPlayer.players[len - 1].alias = user.get("username");
                    waitingPlayer.players[len - 1].waitingTime = "0";
                }
            //}
            // Envoyer une requête au serveur pour rejoindre la file d'attente
            //await axios.post('/matchmaking'); // a modifier
            setIsInQueue(true);
        } catch (error) {
            console.error('Erreur lors de la tentative de rejoindre la file d\'attente de matchmaking :', error);
        }
    };

    function showWaitingPlayer(){ //n'affiche pas le player et le temps d'attente

        const lengthplayers = waitingPlayer.players.length;
        console.log("lenghtplayers:", lengthplayers);
        for (let i = 0; i < lengthplayers; i++){
            console.log(waitingPlayer.players[i].alias);
            <div>
                <p>Player : {waitingPlayer.players[i].alias}</p>
                <p>Temps d'attente : {waitingPlayer.players[i].waitingTime} secondes</p>
            </div>
        }
    }

    console.log("isInQueue:", isInQueue);
    return (
        <>
            <div>
                {!isInQueue ? (
                    <button onClick={joinMatchmakingQueue}>Rejoindre la file d'attente</button>
                ) : (
                    <div class="container-fluid">
                        <div>
                            <p>En attente d'autres joueurs...</p>
                                {showWaitingPlayer()}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Matchmaking;