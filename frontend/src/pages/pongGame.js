import React, { useEffect, useRef, useState } from 'react';
import useUser from "../hooks/useUserStorage";
import { Link } from 'react-router-dom';
import "./pongGame.css"
import "./modePong"

const CANVAS_HEIGHT = window.innerHeight * 0.5149330587;
const CANVAS_WIDTH = window.innerWidth* 0.52083;
const PLAYER_HEIGHT = CANVAS_HEIGHT / 5;
const PLAYER_WIDTH = CANVAS_WIDTH * 0.012;
var players =[];
var x = 0;

const setupPlayers = () => {

  for (let i = 1; i <= 2; i++) {
    const aliascheck = localStorage.getItem(`alias${i}`)
    if(aliascheck)
      var alias = aliascheck.split("@+");
    if (aliascheck) {
        players.push({name : alias[0], wins : 0, log: alias[1]});
        console.log("player", i, " = ", players[i - 1 ].name);
        }
    }
  }

var colorsArrows = {
  i : 0,
  Value : ['white','red','green','yellow']
};

const PongGame = () => {
  
  if(x == 0)
    setupPlayers();
  const user = useUser("user");
  const p1 = user.get("username");
  const p2 = players[1].name;
  const canvasRef = useRef(null);
  const [game, setGame] = useState({
    feature: {
      on: true,
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
    winnerN:'',
    player: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: p1,
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
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
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

  let animId;
  const stop = () => {
    cancelAnimationFrame(animId);
    // Reset game state
  };

  const playerMove = () => {

    if(game.keysPressed.player.w == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: Math.max(0, prevGame.player.y - PLAYER_HEIGHT/10),
        },
      }));
    }
    else if(game.keysPressed.player.s == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.player.y + PLAYER_HEIGHT/10),
        },
      }));
    }
    if(game.keysPressed.computer.ArrowUp == true)
    {
        setGame((prevGame) => ({
          ...prevGame,
          computer: {
            ...prevGame.computer,
            y: Math.max(0, prevGame.computer.y - PLAYER_HEIGHT/10),
          },
        }));
    }
    else if(game.keysPressed.computer.ArrowDown == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        computer: {
          ...prevGame.computer,
          y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.computer.y + PLAYER_HEIGHT/10),
        },
      }));
    }
  }

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

  const collide = (Who) => {
    const { ball } = game;
    if (game.ball.y < Who.y || game.ball.y > Who.y + PLAYER_HEIGHT) {
      resetCanva();
      if (Who !== game.computer) {
          game.computer.score++;
      } else {
          game.player.score++;
          //document.querySelector('#player-score').textContent = game.player.score;
      }
    }
    else {
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          speed: {
            ...prevGame.ball.speed,
            x: ball.speed.x * -1.2,
          },
        },
      }));
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
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let lastFrameTime = performance.now();
    const targetFPS = 200;
    const frameInterval = 1000 / targetFPS;
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
    if(game.computer.score == 1)
    {
      resetCanva();
      draw();
      game.winner= true;
      game.winnerN = game.computer.name;
    }
    else if(game.player.score == 1)
    {
      resetCanva();
      draw();
      game.winner = true;
      game.winnerN = game.player.name;
    }
    else
      update();
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [game.ball.x,game.play]);

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
    console.log(game.play);
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
      for (let i = 1; i <= 2; i++) {
        localStorage.removeItem('alias'+i);
        }
      players= [];
    };
  }, []);

  // RESPONSIIIIIIIVEEEEEEE

  useEffect(() => {
    function handleResize() {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      game.ball.y = game.ball.y /canvas.height * window.innerHeight * 0.5149330587;
      game.ball.x = game.ball.x / canvas.width * window.innerWidth * 0.52083;
      game.player.y = game.player.y / canvas.height * window.innerHeight * 0.5149330587;
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
    const canvas = canvasRef.current;
    setGame((prevGame) => ({
      ...prevGame,
      player:{
        ...prevGame.player,
        y:canvas.height/2 - PLAYER_HEIGHT / 2,
      },
      player3:{
        ...prevGame.player3,
        y:canvas.height /2 - PLAYER_HEIGHT,
      },
      computer:{
        ...prevGame.computer,
        y:canvas.height / 2 - PLAYER_HEIGHT / 2,
      },
      ball: {
        ...prevGame.ball,
        x: canvas.width / 2,
        y: canvas.height / 2,
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
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />

      {game.winner && (
        <div class="alert alert-primary" role="alert" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)' }}>
        {game.winnerN} won the Match !<a href="/modepong" class="alert-link">Back</a>
      </div>
      )}
      <div className = "scorej1">{game.player.name} : {game.player.score}</div>
      <div className = "scorej2">{game.computer.name} : {game.computer.score}</div>
      <button id = "featureB" className = "Feature" onClick={handleFeature}>Feature ON/OFF</button>
      <button id = "play" className = "play" onClick={handlePlay}>Play!</button>
    </div>
  );
};

export default PongGame;