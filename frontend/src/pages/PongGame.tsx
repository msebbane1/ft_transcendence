import React, { useState, useEffect, useRef } from 'react';

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 12;

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasElement = {
    width: 800, // Remplacez par la largeur souhaitée
    height: 600, // Remplacez par la hauteur souhaitée
  };

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
  const [anim, setAnim] = useState<number | null>(null);
  const [hitEffect, setHitEffect] = useState(false);

  const colorsArrows = {
    i: 0,
    Value: ['white', 'red', 'green', 'yellow'],
  };

  const draw = () => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const context = canvasElement.getContext('2d');
    if (!context) return;

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvasElement.width, canvasElement.height);

    context.fillStyle = 'purple';
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvasElement.width - PLAYER_WIDTH, 0, PLAYER_WIDTH, canvasElement.height);

    context.beginPath();
    context.fillStyle = colorsArrows.Value[colorsArrows.i];
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
  };

  const play = () => {
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
    draw();
    ballMove();
    setAnim(requestAnimationFrame(play));
  };

  const playerMove = (event: MouseEvent) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const canvasPos = canvasElement.getBoundingClientRect();
    const mousePos = event.clientY - canvasPos.y;
    if (mousePos < PLAYER_HEIGHT / 2) {
      setGame((prevGame) => ({ ...prevGame, player: { ...prevGame.player, y: 0 } }));
    } else if (mousePos > canvasElement.height - PLAYER_HEIGHT / 2) {
      setGame((prevGame) => ({ ...prevGame, player: { ...prevGame.player, y: canvasElement.height - PLAYER_HEIGHT } }));
    } else {
      setGame((prevGame) => ({ ...prevGame, player: { ...prevGame.player, y: mousePos - PLAYER_HEIGHT / 2 } }));
    }
  };

  const computerMove = () => {
    game.computer.y += game.ball.speed.y * 0.85;
  };
 
  const collide = (player: any) => {
    	if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT && player.y !== -1)
    	{
      		const canvasElement = canvasRef.current;
      		if (!canvasElement) {return;}
      		const context = canvasElement.getContext('2d');
      		if (!context) {return;}

      		context.clearRect(0, 0, canvasElement.width, canvasElement.height);
      		game.ball.x = canvasElement.width / 2;
      		game.ball.y = canvasElement.height / 2;
      		game.player.y = canvasElement.height / 2 - PLAYER_HEIGHT / 2;
      		colorsArrows.i = 0;
      		draw();
      		game.ball.speed.x = 1;
      		if (player === game.player){
        		setGame((prevGame) => ({ ...prevGame, computer: { ...prevGame.computer, score: prevGame.computer.score + 1 } }));}
		else{
        		setGame((prevGame) => ({ ...prevGame, player: { ...prevGame.player, score: prevGame.player.score + 1 } }));}
      		sleep(20);
    	}  /*
    	else {
      		if (colorsArrows.i + 1 < colorsArrows.Value.length) 
        		colorsArrows.i++;
		else
			colorsArrows.i = 0;
      		game.ball.speed.x *= -1.1;
    	}*/
  };

  const ballMove = () => {
    if (game.ball.y > canvasElement.height || game.ball.y < 0) {
      game.ball.speed.y *= -1;
    }
    if (game.ball.x > canvasElement.width - PLAYER_WIDTH) {
      collide(game.computer);
    } else if (game.ball.x < PLAYER_WIDTH) {
      collide(game.player);
    }
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
  };

  const changeDirection = (playerPosition: number) => {
    const impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    const ratio = 100 / (PLAYER_HEIGHT / 2);
    game.ball.speed.y = Math.round(impact * ratio / 10);
  };

  const stopGame = () => {
    if (anim) {
      cancelAnimationFrame(anim);
    }
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    
    game.ball.x = canvasElement.width / 2;
    game.ball.y = canvasElement.height / 2;
    game.player.y = canvasElement.height / 2 - PLAYER_HEIGHT / 2;
    game.computer.y = -1;
    game.ball.speed.x = 1;
    game.ball.speed.y = 1;
    colorsArrows.i = 0;
    setGame({ ...game, computer: { ...game.computer, score: 0 }, player: { ...game.player, score: 0 } });
    draw();
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener('mousemove', playerMove);
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('mousemove', playerMove);
      }
    };
  }, []);

  useEffect(() => {
    draw();
  }, [game]);

  return (
    <div>
      <canvas ref={canvasRef} width={canvasElement.width} height={canvasElement.height}></canvas>
      <button onClick={play}>Start</button>
      <button onClick={stopGame}>Stop</button>
    </div>
  );
};

export default PongGame;

