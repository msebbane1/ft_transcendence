import React, { useEffect, useState } from "react";
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
    const [showForm, setShowForm] = useState(false);
    const user = useUser("user");
    const [username, setUsername] = useState('');//recuperer le username en entrer
	const [password, setPassword] = useState('');//recuperer le mot de passe en entrer
    //const [userId, setUserId] = useState('');// recupere l'id du joueur
    const [waitingPlayer, setWaitingPLayer] = useState({
        players: [{
            alias: '\0',
            winrate: 0, //a recuperer dans la database
            waitingTime: 0, //initialise le temps a 0
        }],
    });
    //const [len, setLen] = useState(0);
    //let len = waitingPlayer.players.length;
    //const len = waitingPlayer.players.length;

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    useEffect(() => {
        // Démarre le compteur pour chaque joueur en utilisant setInterval
        const intervalId = setInterval(() => {
            // Met à jour le temps d'attente pour chaque joueur en incrémentant de 1
            setWaitingPLayer(prevState => ({
                ...prevState,
                players: prevState.players.map(player => ({
                    ...player,
                    waitingTime: player.waitingTime + 1,
                }))
            }));
        }, 1000); // Met à jour toutes les secondes (1000ms)

        // Nettoie le timer lorsque le composant est démonté ou mis à jour
        return () => clearInterval(intervalId);
    }, []); // Utilise une dépendance vide pour exécuter cet effet uniquement une fois après le montage initial

	const handleSubmit = async (e) => {
        console.log('form submitted');
        setShowForm(true);
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
        joinMatchmakingQueue();
        setShowForm(false);
    };

    // Fonction pour rejoindre la file d'attente de matchmaking
    const joinMatchmakingQueue = async () => {
        try {
            //const prevlen = len;
           // console.log('len:', len, 'username:', username);
            // waitingPlayer.players.length += 1;
            // console.log('PB LEN', waitingPlayer.players.length);
            // if (waitingPlayer.players)
            //     console.log('PLAYERS');
            // if (len - 1 < waitingPlayer.players.length)
            //     console.log('PB LEN', waitingPlayer.players.length);

            if (waitingPlayer.players) {
                if(!username){
                    waitingPlayer.players[waitingPlayer.players.length - 1].alias = user.get("username"); //modifier index pour remplir au bon endroit sans modifier le player deja mis
                    console.log('user:', user.get("username"));
                }
                else {
                    console.log('username:', username);
                    waitingPlayer.players[waitingPlayer.players.length - 1].alias = username;
                }
            }
            else
                console.log('FAILED');
            //setLen(prevlen + 1);
            setIsInQueue(true);
        } catch (error) {
            console.error('Erreur lors de la tentative de rejoindre la file d\'attente de matchmaking :', error);
        }
        //console.log('len:', len, 'username:', username);
    };

    function displayWaitingPlayers(){
        return (
            <div>
                {waitingPlayer.players.map((player, index) => (
                    <div key={index}>
                        <p>Joueur : {player.alias} | Temps d'attente : {player.waitingTime} secondes</p>
                    </div>
                ))}
                {
                    console.log('waitingPlayer:', waitingPlayer.players)
                }
                {/* {
                    waitingPlayer.players.forEach((element, index) => {
                        <div key={index}>
                            <p>Joueur : {element.alias} | Temps d'attente : {element.waitingTime} secondes</p>
                        </div>
                    })
                } */}
            </div>
        );
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    //console.log("isInQueue:", isInQueue);
    console.log("showForm:", showForm);
    return (
        <>
            <div>
                {!isInQueue ? (
                    <button onClick={joinMatchmakingQueue}>Rejoindre la file d'attente</button>
                ) : (
                    <div class="container-board">
                        <div>
                            <p>En attente d'autres joueurs</p>
                                {displayWaitingPlayers()}
                            <button className="btn btn-danger" onClick={() => setIsInQueue(false)}>Annuler la recherche</button>
                        </div>
                    </div>
                )}
                <button onClick={toggleForm}>Connecter un autre joueur</button>
                 { showForm && (
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
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
			    )}
            </div>
        </>
    );
}

export default Matchmaking;
