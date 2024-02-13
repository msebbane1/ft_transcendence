import React, { useEffect, useRef, useState } from 'react';
import "./pongGame.css"
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 12;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1000;
var colorsArrows = {
  i : 0,
  Value : ['white','red','green','yellow']
};

const PongGame = () => {
  const canvasRef = useRef(null);
  const [game, setGame] = useState({
    feature: {
      on: true,
    },
    player: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: "Marco",
    },
    player3: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT,
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      score: 0,
      name: "Marco",
    },
    computer: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: "Jeannot",
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

  let animId


  // JOUEUR MOVE

  // const player2Move = (event) => {
  //   const canvas = canvasRef.current;
  //   const canvasPos = canvas.getBoundingClientRect();
    
  // };


// MOUSE MOVE 

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
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          speed: {
            ...prevGame.ball.speed,
            x: ball.speed.x * -1,
          },
        },
      }));
      if(game.ball.y <= game.player3.y + PLAYER_HEIGHT / 4 && game.ball.speed.y > 0)
      {
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
      else if(game.ball.y >= game.player3.y + PLAYER_HEIGHT / 4 && game.ball.speed.y < 0)
      {
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
    }
        setGame((prevGame) => ({
      ...prevGame,
      ball: {
        ...prevGame.ball,
        x: prevGame.ball.x + prevGame.ball.speed.x,
        y: prevGame.ball.y + prevGame.ball.speed.y,
      },
    }));
    draw();
    if (ball.x + ball.r > canvas.width - PLAYER_WIDTH) {
      collide(game.computer);
    }
    else if (ball.x - ball.r < PLAYER_WIDTH) {
      collide(game.player);
    }
  };
  
  const collide = (Who) => {
    var canvas = canvasRef.current;
    const { ball } = game;
    if (game.ball.y < Who.y || game.ball.y > Who.y + PLAYER_HEIGHT) {
      cancelAnimationFrame(animId);
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
      if (Who !== game.computer) {
          game.computer.score++;
          //document.querySelector('#computer-score').textContent = game.computer.score;
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
            x: ball.speed.x * -1,
          },
        },
      }));
      if (game.ball.y <= Who.y + PLAYER_HEIGHT / 2 && game.ball.speed.y > 0) {
        setGame((prevGame) => ({
          ...prevGame,
          ball: {
            ...prevGame.ball,
            speed: {
              ...prevGame.ball.speed,
              y: ball.speed.y * - 1,
            },
          },
        }));
      } 
      else if (game.ball.y >= Who.y + PLAYER_HEIGHT / 2 && game.ball.speed.y < 0) {
        setGame((prevGame) => ({
          ...prevGame,
          ball: {
            ...prevGame.ball,
            speed: {
              ...prevGame.ball.speed,
              y: ball.speed.y * - 1,
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
      draw();
    }
  };

  useEffect(() => { // gestion touches pour joueurs 1 et 2
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setGame((prevGame) => ({
            ...prevGame,
            computer: {
              ...prevGame.computer,
              y: Math.max(0, prevGame.computer.y - PLAYER_HEIGHT/5),
            },
          }));
          break;
        case 'ArrowDown':
          setGame((prevGame) => ({
            ...prevGame,
            computer: {
              ...prevGame.computer,
              y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.computer.y + PLAYER_HEIGHT/5),
            },
          }));
          break;
        default:
          break;
      }
      switch (event.keyCode) {
        case 87:
          setGame((prevGame) => ({
            ...prevGame,
            player: {
              ...prevGame.player,
              y: Math.max(0, prevGame.player.y - PLAYER_HEIGHT/5),
            },
          }));
          break;
        case 83:
          setGame((prevGame) => ({
            ...prevGame,
            player: {
              ...prevGame.player,
              y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.player.y + PLAYER_HEIGHT/5),
            },
          }));
          break;
        default:
          break;}
    };

    canvasRef.current.addEventListener('mousemove', p3Move);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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
        ballMove();
  
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
  
      animId = requestAnimationFrame(update);
    };
  
    update();
  
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [game.ball.x]);

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

  const stop = () => {
    cancelAnimationFrame(animId);
    // Reset game state
  };

  return (
    <div className = "canvas">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
      {/* <button onClick={stop}>Stop</button> */}
      <div className = "scorej1">{game.player.name} : {game.player.score}</div>
      <div className = "scorej2">{game.computer.name} : {game.computer.score}</div>
      <button id = "featureB" className = "Feature" onClick={handleFeature}>Feature ON/OFF</button>
    </div>
  );
};

export default PongGame;