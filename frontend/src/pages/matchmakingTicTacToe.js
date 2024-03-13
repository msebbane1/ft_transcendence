import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUserStorage";
import axios from 'axios';
import './matchmakingTicTacToe.css';
import ShowTicTacToeM from "./showTicTacToeM";
var nbPlayers = 0;
var MATCH = [];
var name = "";
var name2 = "";
var queueUp = false;
var toSet = [];

function Matchmaking(){

    const [isInQueue, setIsInQueue] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [statsGames, setStatsGames] = useState('');
    const [statsGames2, setStatsGames2] = useState('');
    const user = useUser("user");
    const [host, setHost] = useState(user.get("pseudo"));
    const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
    const [matchUp, setMatchUp] = useState(false);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [waitingPlayer, setWaitingPLayer] = useState({
        players: [
            {
                alias: '\0',
                winrate: -1,
                waitingTime: 0,
                Matched: false,
            },
            {
                alias: '\0',
                winrate: -1,
                waitingTime: 0,
                matched: false,
            },
            {
                alias: '\0',
                winrate: -1,
                waitingTime: 0,
                matched: false,
            },
            {
                alias: '\0',
                winrate: -1,
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
        setShowForm(true);
        e.preventDefault();
        axios.post('https://localhost:8080/api/signintournament2/', {
            username,
            password,
            host,
          })
          .then(response => {
            const data = response.data;
            if(username && areValuesUnique(waitingPlayer.players[0].alias, waitingPlayer.players[1].alias, waitingPlayer.players[2].alias, waitingPlayer.players[3].alias, username)) {
                setShowForm(false);
                joinMatchmakingQueue();
            } else {
                setError("User/Alias doesn't exist or already in use.");
                setTimeout(() => setError(null), 2000);
            }
          })
          .catch(error => {
            if (error.response && error.response.data) {
                setUsername('');
                setPassword('');
                setError(error.response.data.error);
                setTimeout(() => setError(null), 2000); // Affiche le message d'erreur renvoyé par le backend
            } else {
                setError("An error occurred while processing your request.");
                setTimeout(() => setError(null), 2000);
            }});
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
        nbPlayers -= 1;
    }
    // useEffect(() => {
    // }, [matc])
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
        toSet = [];
    }
    // fonction qui verifie si des users matchent a utiliser avec des intervales
    useEffect(() => {
            // Verifie si chaque winrate a une difference de 5 ou moins par rapport aux autres winrarates
            waitingPlayer.players.forEach((player, index) => {
                for (let i = 0; i < waitingPlayer.players.length; i++) {
                    if (i !== index) {
                        const diff = Math.abs(player.winrate - waitingPlayer.players[i].winrate);
                        if (diff <= (5 + (player.waitingTime / 2)) && player.alias !== '\0' && waitingPlayer.players[i].alias !== '\0' && player.winrate !== -1 && waitingPlayer.players[i].winrate !== -1 && queueUp == true) {
                            handleMatches(index, i);
                            return; // Sortir de la boucle dès qu'une correspondance est trouvée
                        }
                    }
                }
            });
    }, [waitingPlayer]);



    useEffect(() => {
        
        return () => {
            nbPlayers = 0;
        }
    }, []);

    // const leaveGame = async () => {
    //     axios.post('https://localhost:8080/api/leaveStatus/', {
    //         toSet,
    //         host,
    //       })
    //       .then(response => {
    //         const data = response.data;
    //       })
    //       .catch(error => {
    //         if (error.response && error.response.data) {
    //             alert(error.response.data.error); 
    //         } else {
    //             alert("An error occurred while processing your request.");
    //         }});
    // }

    // Fonction pour rejoindre la file d'attente de matchmaking
    const joinMatchmakingQueue = async () => {
        if(matchUp === false) {
            if (waitingPlayer.players && nbPlayers < 4) {
                if(!username && areValuesUnique(waitingPlayer.players[0].alias, waitingPlayer.players[1].alias, waitingPlayer.players[2].alias, waitingPlayer.players[3].alias, host)){
                    try {
                        const res_stat = await axios.post('https://localhost:8080/api/stats_gamesttt/', {
                            'username': host,
                        });
                        if (res_stat.data.error)
                            setStatsGames({'message': ""});
                        else {
                            if(nbPlayers < 4)
                                nbPlayers += 1;
                            const wr = res_stat.data.wrCheck;
                            queueUp = true;
                            setWaitingPLayer(prevState => {
                                const index = prevState.players.findIndex(player => player.alias === '\0');
                                if (index !== -1) {
                                    const updatedPlayers = [...prevState.players];
                                    updatedPlayers[index] = {
                                        ...updatedPlayers[index],
                                        alias: host,
                                        winrate: wr,
                                    };
                                    return {
                                        ...prevState,
                                        players: updatedPlayers,
                                    };
                                }
                                return prevState;
                            });
                        }
                    } catch (error) {
                        setError(error.response.data.error);
                        setTimeout(() => setError(null), 2000);
                    }
                }
                else if(username && areValuesUnique(waitingPlayer.players[0].alias, waitingPlayer.players[1].alias, waitingPlayer.players[2].alias, waitingPlayer.players[3].alias, username)){
                    try {
                        const res_stat = await axios.post('https://localhost:8080/api/stats_gamesttt/', {
                            'username': username,
                        });
                        if (res_stat.data.error)
                        {
                            setStatsGames({'message': ""});
                        }
                        else {
                            if(nbPlayers < 4)
                                nbPlayers += 1;
                            const wr = res_stat.data.wrCheck;
                            queueUp = true;
                            setWaitingPLayer(prevState => {
                                const index = prevState.players.findIndex(player => player.alias === '\0');
                                if (index !== -1) {
                                    const updatedPlayers = [...prevState.players];
                                    updatedPlayers[index] = {
                                        ...updatedPlayers[index],
                                        alias: username,
                                        winrate: wr,
                                    };
                                    return {
                                        ...prevState,
                                        players: updatedPlayers,
                                    };
                                }
                                return prevState;
                            });
                        }
                    } catch (error) {
                        setError(error.response.data.error);
                        setTimeout(() => setError(null), 2000);
                    }
            }}
            else
                console.log('FAILED');
            setIsInQueue(true);
            setPassword('');
            setUsername('');
        }
    };

    function displayWaitingPlayers(){
        return (
            <div>
                {waitingPlayer.players.map((player, index) => (
                    <div key={index}>
                        {player.alias != '\0' && <p>Player: {player.alias} | Waiting time : {player.waitingTime} seconds</p>}
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

    function closePopup() {
        var popUpOverlay = document.querySelector('.pop-up-overlay');
        popUpOverlay.style.display = 'none';
    }

    const toggleForm = () => {
        if(matchUp === false)
            setShowForm(!showForm);
    };
    return (
        <>
            <div>
                {!areValuesEmpty(waitingPlayer.players[0].alias, waitingPlayer.players[1].alias, waitingPlayer.players[2].alias, waitingPlayer.players[3].alias) && (
                    <div className="container-board">
                        <div>
                            <p>Waiting for other players</p>
                                {displayWaitingPlayers()}
                            <button className="btn btn-danger" onClick={resetQueue}>Cancel</button>
                        </div>
                    </div>
                )}
                {nbPlayers < 4  && (
                    <div>
                        <button className="toconnect" onClick={joinMatchmakingQueue}>Join Queue</button>
                        <button className="toconnect" onClick={toggleForm}>Connect an other player</button> 
                    </div>
                
                )}
                {showForm && (
                    <div className="pop-up-overlay">
                        <div className="pop-up">
                            <div className="alert alert-info" role="alert">
                                <button type="button" className="btn-close" aria-label="Close" onClick={closePopup}></button>
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
                                {error && <div className="text-danger">{error}</div>}
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
            </div>
        </>
    );
}

export default Matchmaking;