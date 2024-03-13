import React, { useEffect, useRef, useState } from 'react';
import "./pongGame.css";
import axios from 'axios';
import useUser from "../hooks/useUserStorage";
const CANVAS_HEIGHT = 500;
const PLAYER_HEIGHT = CANVAS_HEIGHT/5;
const PLAYER_WIDTH = 12;
const TOWIN = 5;
const CANVAS_WIDTH = 1000;
var winnerN = "";
var p2state;
var p3state;
var maxSpeed = 25;
var players = [];
var x = 0;
const matchType = "";
var colorsArrows = {
  i : 0,
  Value : ['white','red','green','yellow']
};
const setupPlayers = () => {

for (let i = 1; i <= 3; i++) {
  const alias = localStorage.getItem(`alias${i}`).split("@+");
  if (alias) {
      if(i == 2)
        p2state = alias[1];
      else if (i == 3)
        p3state = alias[1];
      players.push({name : alias[0], wins : 0, log: alias[1]});
      }
  }
}
const PongGame3p = () => {

  if(x == 0)
    setupPlayers();
  const user = useUser("user");
  const p1 = user.get("username");
  const p2 = players[1].name;
  const p3 = players[2].name;
  const canvasRef = useRef(null);
  const [axiosCalled, setAxiosCalled] = useState(false);
  const [game, setGame] = useState({
    feature: {
      on: false,
    },
    keysPressed:{
      player:{
        w:false,
        s:false,
      },
      computer:{
        ArrowDown:false,
        ArrowUp:false,
      },
    },
    play:false,
    winner:false,
    lasthit:0,
    winnerN:'',
    player: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: p1,
    },
    player3: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT,
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      score: 0,
      name: p3,
    },
    computer: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: p2,
    },
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      r: 5,
      speed: {
        x: 6,
        y: 6,
      },
    },
  });

  const draw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0,0, context.canvas.width, context.canvas.height)
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'purple';
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);//joueur gauche
    context.fillRect(game.player3.x, game.player3.y, PLAYER_WIDTH/2, PLAYER_HEIGHT/2);//joueur centre 
    context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);//joueur droite
    context.beginPath();
    if(game.feature.on == false)
    {
      context.fillStyle = 'white';
      context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
      context.fill();
    }
    else
    {
      context.fillStyle = colorsArrows.Value[colorsArrows.i];
      context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
      context.fill();
    }
  };
  
  const p3Move = (event) => {
    const canvas = canvasRef.current;
    const canvasPos = canvas.getBoundingClientRect();
    const mousePos = event.clientY - canvasPos.y;

    if (mousePos < 0) {
      setGame((prevGame) => ({
        ...prevGame,
        player3: {
          ...prevGame.player3,
          y: 0,
        },
      }));
    } else if (mousePos > CANVAS_HEIGHT - PLAYER_HEIGHT / 2) {
      setGame((prevGame) => ({
        ...prevGame,
        player3: {
          ...prevGame.player3,
          y: CANVAS_HEIGHT - PLAYER_HEIGHT/2,
        },
      }));
    } else {
      setGame((prevGame) => ({
        ...prevGame,
        player3: {
          ...prevGame.player3,
          y: mousePos,
        },
      }));
    }
  };

  const ballMove = () => {
    const canvas = canvasRef.current;
    const { ball } = game;
    if (game.ball.y + game.ball.r >= CANVAS_HEIGHT || ball.y - ball.r < 0){
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          speed: {
            ...prevGame.ball.speed,
            y: ball.speed.y * -1,
          },
        },
      }));
    }
    if  (game.ball.x >= CANVAS_WIDTH / 2 - PLAYER_WIDTH / 4 && // THIRDPLAYER VALUES A MODIFIER SI TAILLE MODIFIEE
    game.ball.x <= CANVAS_WIDTH / 2 + PLAYER_WIDTH / 4 &&
    game.ball.y <= game.player3.y + PLAYER_HEIGHT / 2 &&
    game.ball.y >= game.player3.y) {
      if(ball.speed.x > 0)
      {
        setGame((prevGame) => ({
          ...prevGame,
          ball: {
            ...prevGame.ball,
            speed: {
              ...prevGame.ball.speed,
              x: Math.max(-maxSpeed, ball.speed.x * -1.2),
            },
          },
        }));
      }
      else
      {
        setGame((prevGame) => ({
          ...prevGame,
          ball: {
            ...prevGame.ball,
            speed: {
              ...prevGame.ball.speed,
              x: Math.min(maxSpeed, ball.speed.x * -1.2),
            },
          },
        }));
      }
      setGame((prevGame) => ({
        ...prevGame,
        lasthit:3,
      }));
      pongPad3p(game.player3.y);
    }
        setGame((prevGame) => ({
      ...prevGame,
      ball: {
        ...prevGame.ball,
        x: prevGame.ball.x + prevGame.ball.speed.x,
        y: prevGame.ball.y + prevGame.ball.speed.y,
      },
    }));
    if (ball.x + ball.r/2 >= canvas.width - PLAYER_WIDTH) {
      ball.x = canvas.width - PLAYER_WIDTH - ball.r/2 - 1;
      collide(game.computer);
    }
    else if (ball.x - ball.r /2 <= PLAYER_WIDTH) {
      ball.x = PLAYER_WIDTH + ball.r/2 + 1;
      collide(game.player);
    }
    playerMove();
  };

  const pongPad = (playerPosition) => {
    var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

const pongPad3p = (playerPosition) => {
  var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 4;
  var ratio = 100 / (PLAYER_HEIGHT / 2);
  game.ball.speed.y = Math.round(impact * ratio / 10);
}

  const collide = (Who) => {
    const { ball } = game;
    if (game.ball.y < Who.y || game.ball.y > Who.y + PLAYER_HEIGHT) {
      resetCanva();
      if (game.lasthit == 1) {
          game.player.score++;
          //document.querySelector('#computer-score').textContent = game.computer.score;
      } else if(game.lasthit == 2) {
          game.computer.score++;
          //document.querySelector('#player-score').textContent = game.player.score;
      }
      else if(game.lasthit == 3){
        game.player3.score++;
      }
    }
    else {
        // Dernier a tap tap
        if(Who == game.computer){
        setGame((prevGame) => ({
          ...prevGame,
          lasthit:2,
        })); 
      }
      else{
        setGame((prevGame) => ({
          ...prevGame,
          lasthit:1,
        })); 
      }
      // Tentative de changement de l angle de rebond
      if(ball.speed.x > 0)
      {
        setGame((prevGame) => ({
          ...prevGame,
          ball: {
            ...prevGame.ball,
            speed: {
              ...prevGame.ball.speed,
              x: Math.max(-maxSpeed, ball.speed.x * -1.2),
            },
          },
        }));
      }
      else
      {
        setGame((prevGame) => ({
          ...prevGame,
          ball: {
            ...prevGame.ball,
            speed: {
              ...prevGame.ball.speed,
              x: Math.min(maxSpeed, ball.speed.x * -1.2),
            },
          },
        }));
      }
      pongPad(Who.y);
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          x: prevGame.ball.x + prevGame.ball.speed.x,
          y: prevGame.ball.y + prevGame.ball.speed.y,
        },
      }));
    }
  };


  const playerMove = () => {

    if(game.keysPressed.player.w == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: Math.max(0, prevGame.player.y - PLAYER_HEIGHT/5),
        },
      }));
    }
    else if(game.keysPressed.player.s == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.player.y + PLAYER_HEIGHT/5),
        },
      }));
    }
    if(game.keysPressed.computer.ArrowUp == true)
    {
        setGame((prevGame) => ({
          ...prevGame,
          computer: {
            ...prevGame.computer,
            y: Math.max(0, prevGame.computer.y - PLAYER_HEIGHT/5),
          },
        }));
    }
    else if(game.keysPressed.computer.ArrowDown == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        computer: {
          ...prevGame.computer,
          y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.computer.y + PLAYER_HEIGHT/5),
        },
      }));
    }
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        game.keysPressed.computer.ArrowUp = true;
        break;
      case 'ArrowDown':
        game.keysPressed.computer.ArrowDown = true;
        break;
      case 'w':
        game.keysPressed.player.w = true;
        break;
      case 's':
        game.keysPressed.player.s = true;
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        game.keysPressed.computer.ArrowUp = false;
        break;
      case 'ArrowDown':
        game.keysPressed.computer.ArrowDown = false;
        break;
      case 'w':
        game.keysPressed.player.w = false;
        break;
      case 's':
        game.keysPressed.player.s = false;
        break;
      default:
        break;
    }
  };

  useEffect(() => { // gestion touches pour joueurs 1 et 2
    user.set("pongAccess", 'fin');
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      canvasRef.current.addEventListener('mousemove', p3Move);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
  }, []);

  useEffect(() => {
    let lastFrameTime = performance.now();
    const targetFPS = 200;
    const frameInterval = 1 / targetFPS;
    let animId;
  
    const update = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
  
      if (deltaTime >= frameInterval) {
        if(colorsArrows.i == 3)
          colorsArrows.i = 0;
        else
          colorsArrows.i += 1;
        draw();
        if(game.play)
          ballMove();
  
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
  
      animId = requestAnimationFrame(update);
    };
    if(game.computer.score == TOWIN)
    {
      resetCanva();
      draw();
      game.winner= true;
      winnerN = game.computer.name;
    }
    else if(game.player.score == TOWIN)
    {
      resetCanva();
      draw();
      game.winner = true;
      winnerN = game.player.name;
    }
    else if(game.player3.score == TOWIN)
    {
      resetCanva();
      draw();
      game.winner = true;
      winnerN = game.player3.name;
    }
    else
      update();
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [game.ball.x, game.play]);


  const handlePlay = () => {
    if(game.play == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        play:false,
      }));
    }
    else
    {
      setGame((prevGame) => ({
        ...prevGame,
        play:true,
      }));
    }
  };

  const handleFeature = () => {
    if(game.feature.on == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        feature: {
          ...prevGame.feature,
          on:false,
        },
      }));
    }
    else
    {
      setGame((prevGame) => ({
        ...prevGame,
        feature: {
          ...prevGame.feature,
          on:true,
        },
      }));
    }
  };

  useEffect(() => {
    return () => {
      x=0;
      for (let i = 1; i <= 3; i++) {
        localStorage.removeItem('alias'+i);
        }
      players= [];
    };
  }, []);

  useEffect(() => { //historique fin de partie2p
    let p1score = game.player.score;
    let p2score = game.computer.score;
    let p3score = game.player3.score;
    if (game.winner && !axiosCalled) {
      axios.post('https://localhost:8080/api/pong3phistory/', {
        p1,
        p2,
        p3,
        p1score,
        p2score,
        p3score,
        p2state,
        p3state,
        winnerN,
        })
        .then(response => {
          const data = response.data;
        })
        .catch(error => {
          if (error.response && error.response.data) {
              alert(error.response.data.error); // Affiche le message d'erreur renvoyé par le backend
          } else {
              alert("An error occurred while processing your request.");
          }});
      }
  }, [game.winner, axiosCalled]);


    // RESPONSIIIIIIIVEEEEEEE

    useEffect(() => {
      function handleResize() {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.ball.y = game.ball.y /canvas.height * window.innerHeight * 0.5149330587;
        game.ball.x = game.ball.x / canvas.width * window.innerWidth * 0.52083;
        game.player.y = game.player.y / canvas.height * window.innerHeight * 0.5149330587;
        game.player3.y = game.player3.y / canvas.height * window.innerHeight * 0.5149330587;
        game.player3.x = game.player3.x / canvas.width * window.innerWidth * 0.52083;
        game.computer.y = game.computer.y / canvas.height * window.innerHeight * 0.5149330587;
        canvas.height = window.innerHeight * 0.5149330587;
        canvas.width = window.innerWidth * 0.52083;
        draw();
      };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    }, [window.innerWidth, window.innerHeight]);

  const resetCanva =() => {

    setGame((prevGame) => ({
      ...prevGame,
      player:{
        ...prevGame.player,
        y:CANVAS_HEIGHT/2 - PLAYER_HEIGHT / 2,
      },
      player3:{
        ...prevGame.player3,
        y:CANVAS_HEIGHT /2 - PLAYER_HEIGHT,
      },
      computer:{
        ...prevGame.computer,
        y:CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      },
      ball: {
        ...prevGame.ball,
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        speed: {
          ...prevGame.ball.speed,
          x:6,
          y:6,
        },
      },
    }));
  }

  return (
    <div className = "canvas">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
      {game.winner && (
          <div className="alert alert-primary" role="alert" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)' }}>
            {winnerN} is the match Winner! <a href="/modepong" className="alert-link">Back</a> 
          </div>
      )}
      <div className = "scorej1">{game.player.name} : {game.player.score}</div>
      <div className = "scorej2">{game.computer.name} : {game.computer.score}</div>
      <div className = "scorej3">{game.player3.name} : {game.player3.score}</div>
      <button id = "featureB" className = "Feature" onClick={handleFeature}>Feature ON/OFF</button>
      <button id = "play" className = "play" onClick={handlePlay}>Play!</button>
    </div>
  );
};

export default PongGame3p;