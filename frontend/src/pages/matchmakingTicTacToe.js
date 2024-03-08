import React, { useEffect, useState } from "react";
//import { Link  } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';
import useUser from "../hooks/useUserStorage";
import axios from 'axios';
import ShowTicTacToe from "./showTicTacToeM";
import './matchmakingTicTacToe.css';
import ShowTicTacToeM from "./showTicTacToeM";

var nbPlayers = 0;
var MATCH = [];
var name = "";
var name2 = "";
var queueUp = false;
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
    // const [ownwr, setOwnwr] = useState(user.get("winrate"));
    const user = useUser("user");
    var host2  = user.get('username');
    const [host, setHost] = useState(user.get("username"));
    const [username, setUsername] = useState('');//recuperer le username en entrer
	const [password, setPassword] = useState('');//recuperer le mot de passe en entrer
    const [matchUp, setMatchUp] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [waitingPlayer, setWaitingPLayer] = useState({
        players: [
            {
                alias: '\0',
                winrate: 0,
                waitingTime: 0,
                Matched: false,
            },
            {
                alias: '\0',
                winrate: 10,
                waitingTime: 0,
                matched: false,
            },
            {
                alias: '\0',
                winrate: 30,
                waitingTime: 0,
                matched: false,
            },
            {
                alias: '\0',
                winrate: 50,
                waitingTime: 0,
                matched: false,
            }
        ],
    });

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    useEffect(() => {
        if(matchUp == true)
            queueUp = false;
        if(matchUp == false)
            queueUp = true;
    },[matchUp]);

    useEffect(() => {
        // Démarre le compteur pour chaque joueur en utilisant setInterval
        const intervalId = setInterval(() => {
            // Met à jour le temps d'attente pour chaque joueur en incrémentant de 1
            setWaitingPLayer(prevState => ({
                ...prevState,
                players: prevState.players.map(player => {
                    if (player.alias !== '\0' && matchUp == false && queueUp == true) { // Vérifie si l'alias n'est pas vide
                        return {
                            ...player,
                            waitingTime: player.waitingTime + 1,
                        };
                    }
                    return player; // Retourne le joueur tel quel s'il n'a pas besoin d'être mis à jour
                })
            }));
        }, 1000);  // Met à jour toutes les secondes (1000ms)
        return () => clearInterval(intervalId);
    }, [])


    const areValuesUnique = (value1, value2, value3, value4, value5) => {
        const nonEmptyValues = [value1, value2, value3, value4, value5].filter(value => value !== '\0');
        let test = new Set(nonEmptyValues);
        return nonEmptyValues.length === test.size;
    };
    
    const areValuesEmpty = (value1, value2, value3, value4) => {
        const nonEmptyValues = [value1, value2, value3, value4].filter(value => value !== '\0');
        return nonEmptyValues.length === 0;
    };


	const handleSubmit = async (e) => {
        console.log('form submitted');
        setShowForm(true);
        e.preventDefault();
        axios.post('https://localhost:8080/api/signintournament/', {
            username,
            password,
          })
          .then(response => {
            const data = response.data;
            if(username && areValuesUnique(waitingPlayer.players[0].alias, waitingPlayer.players[1].alias, waitingPlayer.players[2].alias, waitingPlayer.players[3].alias, username)) {
              joinMatchmakingQueue(data.winrate);
            } else {
              alert("User/Alias doesn't exist or already in use.");
            }
          })
          .catch(error => {
            if (error.response && error.response.data) {
                alert(error.response.data.error); // Affiche le message d'erreur renvoyé par le backend
            } else {
                alert("An error occurred while processing your request.");
            }});
        setShowForm(false);
    };


    // fonction qui gere les match
    const handleMatches =   async (indexP1, indexP2) => {

        name = waitingPlayer.players[indexP1].alias;
        name2 = waitingPlayer.players[indexP2].alias;
        MATCH=[waitingPlayer.players[indexP1].alias, indexP1, waitingPlayer.players[indexP2].alias, indexP2];
        popUp();
        setMatchUp(true);
        setWaitingPLayer(prevState => ({
            ...prevState,
            players: prevState.players.map((player, index) => {
                if (index === indexP1 || index === indexP2) {
                    return {
                        alias: '\0',
                        winrate: -1,
                        waitingTime: 0,
                        matched: false,
                    };
                }
                return player;
            })
        }));
        nbPlayers -= 2;
    }

    //fonction de reset lors de l'annulation de la rechercher
    const resetQueue = async () => {
        
        setWaitingPLayer(prevState => ({
            ...prevState,
            players: prevState.players.map(() => ({
                alias: '\0',
                winrate: -1,
                waitingTime: 0,
                matched: false,
              }))
            }));
        nbPlayers = 0;
        queueUp=false;
    }
    // fonction qui verifie si des users matchent a utiliser avec des intervales
    useEffect(() => {
            // Verifie si chaque winrate a une difference de 5 ou moins par rapport aux autres winrarates
            waitingPlayer.players.forEach((player, index) => {
                for (let i = 0; i < waitingPlayer.players.length; i++) {
                    if (i !== index) {
                        const diff = Math.abs(player.winrate - waitingPlayer.players[i].winrate);
                        if (diff <= (5 + (player.waitingTime / 5)) && player.alias !== '\0' && waitingPlayer.players[i].alias !== '\0' && player.winrate !== -1 && waitingPlayer.players[i].winrate !== -1 && queueUp == true) {                            handleMatches(index, i);
                            return; // Sortir de la boucle dès qu'une correspondance est trouvée
                        }
                    }
                }
            });
    }, [waitingPlayer]);



    //A VOIR APRES
    // useEffect(() => {
        
    // }, [waitingPlayer.players.matched]);

    // Fonction pour rejoindre la file d'attente de matchmaking
    const joinMatchmakingQueue = async (wr) => {
            if (waitingPlayer.players && nbPlayers < 4) {
                if(!username && areValuesUnique(waitingPlayer.players[0].alias, waitingPlayer.players[1].alias, waitingPlayer.players[2].alias, waitingPlayer.players[3].alias, host2)){
                    //const index2 = waitingPlayer.players.findIndex(player => player.alias === host);
                    setWaitingPLayer(prevState => {
                        const index = prevState.players.findIndex(player => player.alias === '\0');
                        if (index !== -1) {
                            const updatedPlayers = [...prevState.players];
                            updatedPlayers[index] = {
                                ...updatedPlayers[index],
                                alias: host,
                                winrate:1,
                            };
                            return {
                                ...prevState,
                                players: updatedPlayers,
                            };
                        }
                        return prevState;
                    });
                    //affecter le winrate
                }
                else if(areValuesUnique(waitingPlayer.players[0].alias, waitingPlayer.players[1].alias, waitingPlayer.players[2].alias, waitingPlayer.players[3].alias, username)){
                    try {
                    } catch (error) {
                        console.error('Erreur lors de la tentative de rejoindre la file d\'attente de matchmaking :', error);
                    }
                    setWaitingPLayer(prevState => {
                        const index = prevState.players.findIndex(player => player.alias === '\0');
                        if (index !== -1) {
                            const updatedPlayers = [...prevState.players];
                            updatedPlayers[index] = {
                                ...updatedPlayers[index],
                                alias: username,
                            };
                            return {
                                ...prevState,
                                players: updatedPlayers,
                            };
                        }
                        return prevState;
                    });
                }
                nbPlayers += 1;
                queueUp = true;
            }
            else
                console.log('FAILED');
            setIsInQueue(true);
            setPassword('');
            setUsername('');
    };

    function displayWaitingPlayers(){
        return (
            <div>
                {waitingPlayer.players.map((player, index) => (
                    <div key={index}>
                        {player.alias != '\0' && <p>Joueur : {player.alias} | Temps d'attente : {player.waitingTime} secondes</p>}
                    </div>
                ))}
            </div>
        );
    };

    function popUp() {
        setShowPopup(true);
        setTimeout(function(){
            setShowPopup(false);
        }, 3000);
    }

    const toggleForm = () => {
        setShowForm(!showForm);
    };
    return (
        <>
            <div>
                {!areValuesEmpty(waitingPlayer.players[0].alias, waitingPlayer.players[1].alias, waitingPlayer.players[2].alias, waitingPlayer.players[3].alias) && (
                    <div class="container-board">
                        <div>
                            <p>En attente d'autres joueurs</p>
                                {displayWaitingPlayers()}
                            <button className="btn btn-danger" onClick={resetQueue}>Annuler la recherche</button>
                        </div>
                    </div>
                )}
                {nbPlayers < 4  && (
                    <div>
                        <button className="toconnect" onClick={joinMatchmakingQueue}>Rejoindre la file d'attente</button>
                        <button className="toconnect" onClick={toggleForm}>Connecter un autre joueur</button> 
                    </div>
                
                )}
                {showForm && (
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
                {showPopup == true && (
                    <div className="pop-up-overlay">
                        <div className="pop-up">
                            <h1>Match Found !</h1>
                            <p>{name} vs {name2}</p>
                        </div>
                    </div>
                )}
                { matchUp == true && showPopup == false && (
                    <ShowTicTacToeM user={name} opponent={name2} setMatchUp={setMatchUp} matchUp={matchUp}/>
                )}
                {/*-pour une compilation plus rapide: recuperer le docker.yml, le dockefile et le .env 
                   -le popUp dans la condition n'affiche rien(ni le pop-up ni le jeu)*/}
            </div>
        </>
    );
}

export default Matchmaking;