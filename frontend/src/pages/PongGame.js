import React, { useEffect, useRef, useState } from 'react';

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 12;

const PongGame = () => {
  const canvasRef = useRef(null);
  const [game, setGame] = useState({
    player: {
      y: 0,
      score: 0,
    },
    computer: {
      y: -1,
      score: 0,
    },
    ball: {
      x: 0,
      y: 0,
      r: 5,
      speed: {
        x: 1,
        y: 1,
      },
    },
  });

  const colorsArrows = {
    i: 0,
    value: ['white', 'red', 'green', 'yellow'],
  };

  let anim;

  const draw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'purple';
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, 0, PLAYER_WIDTH, canvas.height);

    context.beginPath();
    context.fillStyle = colorsArrows.value[colorsArrows.i];
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
  };

  const play = () => {
    setGame((prevGame) => ({
      ...prevGame,
      ball: {
        ...prevGame.ball,
        x: prevGame.ball.x + prevGame.ball.speed.x,
        y: prevGame.ball.y + prevGame.ball.speed.y,
      },
    }));

    draw();
    ballMove();
    anim = requestAnimationFrame(play);
  };

  const playerMove = (event) => {
    const canvas = canvasRef.current;
    const canvasPos = canvas.getBoundingClientRect();
    const mousePos = event.clientY - canvasPos.y;

    if (mousePos < PLAYER_HEIGHT / 2) {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: 0,
        },
      }));
    } else if (mousePos > canvas.height - PLAYER_HEIGHT / 2) {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: canvas.height - PLAYER_HEIGHT,
        },
      }));
    } else {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: mousePos - PLAYER_HEIGHT / 2,
        },
      }));
    }
  };

  const ballMove = () => {
    const canvas = canvasRef.current;

    if (game.ball.y > canvas.height || game.ball.y < 0) {
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          speed: {
            ...prevGame.ball.speed,
            y: prevGame.ball.speed.y * -1,
          },
        },
      }));
    }

    if (game.ball.x > canvas.width - PLAYER_WIDTH) {
      collide(game.computer);
    } else if (game.ball.x < PLAYER_WIDTH) {
      collide(game.player);
    }

    setGame((prevGame) => ({
      ...prevGame,
      ball: {
        ...prevGame.ball,
        x: prevGame.ball.x + prevGame.ball.speed.x,
        y: prevGame.ball.y + prevGame.ball.speed.y,
      },
    }));
  };

  const collide = (player) => {
    // ... (same as before)
  };

  const changeDirection = (playerPosition) => {
    // ... (same as before)
  };

  const stop = () => {
    cancelAnimationFrame(anim);
    // Reset game state here
    // ...
    draw();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    setGame((prevGame) => ({
      ...prevGame,
      player: {
        ...prevGame.player,
        y: canvas.height / 2 - PLAYER_HEIGHT / 2,
      },
      ball: {
        ...prevGame.ball,
        x: canvas.width / 2,
        y: canvas.height / 2,
      },
    }));
    draw();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500} onMouseMove={playerMove} />
      <button onClick={play}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};

export default PongGame;

