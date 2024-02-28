import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import "./pongGame.css"
//import "./modePong"

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 12;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1000;
const TOWIN = 1;
var   MATCHN  = 0;
var   tournOver = false;
var   totOver = false;
var   tournSet = false;
var  matches = [];
var  players = [];
var x = 0;
var colorsArrows = {
  i : 0,
  Value : ['white','red','green','yellow']
};


//if(!localStorage.getItem(`alias1`[0]))
//window.location.href = '/pongGame';
const setupTournament = () => {

    for (let i = 1; i <= 4; i++) {
    const alias = localStorage.getItem(`alias${i}`).split("@+");
    if (alias) {
        console.log(alias[1]);
        players.push({name : alias[0], wins : 0, log: alias[1]});
        }
        //else add user value recuperee depuis la connexion et stockee dans le localstorage pour la partie
    }
    matches.push([players[0].name, players[1].name, "-", "-"]);
    matches.push([players[2].name, players[3].name, "-", "-"]);
    matches.push([players[0].name, players[2].name, "-", "-"]);
    matches.push([players[1].name, players[3].name, "-", "-"]);
    matches.push([players[0].name, players[3].name, "-", "-"]);
    matches.push([players[1].name, players[2].name, "-", "-"]);

}




// PONG GAME  A LANCER UNE FOIS TOUT SETU
const TournamentPong = () => {
  if(x == 0)
  {
    setupTournament();
    x+=1;
  }
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
      name: matches[MATCHN][0],
    },
    computer: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: matches[MATCHN][1],
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
    // Reset game state CANCELLED ATM
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
//NOUVELLE GESTION DES PADS

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
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  useEffect(()=> {

    if(game.computer.score == TOWIN)
    {
      resetCanva();
      draw();
      game.winner= true;
      game.winnerN = game.computer.name;
      const playerIndex = players.findIndex(player => player.name === game.computer.name);
      matches[MATCHN][3] = "V";
      matches[MATCHN][2] = "D";
      players[playerIndex].wins += 1;
      if(MATCHN== 5)
      {
        tournOver = true;
        let {maxIndex, maxIndex2} = getMaxOfColumn();
        console.log(maxIndex);
        console.log(maxIndex2);
        if(maxIndex2 == -1)
        {
          console.log(maxIndex, maxIndex2);
          game.winnerN = players[maxIndex].name;
          totOver = true;
        }
        else //DERNIER MATCH LETS GO
          matches.push([players[maxIndex].name,  players[maxIndex2].name]);
      }
      else if(MATCHN == 6)
        totOver = true;
    }
    else if(game.player.score == TOWIN)
    {
        resetCanva();
        draw();
        game.winner= true;
        game.winnerN = game.player.name;
        const playerIndex = players.findIndex(player => player.name === game.player.name);
        matches[MATCHN][2] = "V";
        matches[MATCHN][3] = "D";
        players[playerIndex].wins += 1;
        if(MATCHN== 5)
        {
          tournOver = true;
          let {maxIndex, maxIndex2} = getMaxOfColumn();
          console.log(maxIndex , maxIndex2);
          if(maxIndex2 == -1)
          {
            console.log(maxIndex);
            game.winnerN = players[maxIndex].name;
            totOver = true;
          }
          else
            matches.push([players[maxIndex].name,  players[maxIndex2].name]);
        }
        else if(MATCHN == 6)
          totOver = true;
    }
  },[game.computer.score, game.player.score]);

  useEffect(() => {
    let lastFrameTime = performance.now();
    const targetFPS = 200;
    const frameInterval = 1 / targetFPS;
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
    if(game.computer.score != TOWIN && game.player.score != TOWIN)
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

  const [buttonClicked, setButtonClicked] = useState(false);

  const handleButtonClick = () => {
    handleMatch(); // Action a effectuer lorsque le bouton est clique
    setButtonClicked(true); // Mettre a jour l'etat du bouton apres le clic
  };

  //reste
  const resetGame = () => {
    resetCanva();
    setGame((prevGame) => ({
      ...prevGame,
      play: false,
      winner: false,
      winnerN: '',
      feature: {
        ...prevGame.player,
        on: true,
      },
      player: {
        ...prevGame.player,
        score: 0,
        name:matches[MATCHN][0],
      },
      computer: {
        ...prevGame.computer,
        score: 0,
        name:matches[MATCHN][1],
      },
      ball: {
        ...prevGame.ball,
        speed: {
          ...prevGame.ball.speed,
          x: 6,
          y: 6,
        },
      },
    }));
    setButtonClicked(false);
  };

  // verif des max dans tab player
  const getMaxOfColumn = () => {
    let maxIndex = -1;
    let maxValue = -Infinity;
  
    for (let i = 0; i < players.length; i++) {
      const value = players[i].wins;
      if (value > maxValue) {
        maxValue = value;
        maxIndex = i;
      }
    }
    let maxValue2 = -Infinity;
    let maxIndex2 = -1;
    for (let i = 0; i < players.length; i++) {
      const value = players[i].wins;
      if (value > maxValue2 && maxIndex != i) {
        maxValue2 = value;
        if(maxValue2 == maxValue)
          maxIndex2 = i;
      }
    }
    console.log(maxIndex, maxValue, maxIndex2, maxValue2);
    return {maxIndex, maxIndex2};
  }

  const handleMatch = () => {
    game.winner = false;
    MATCHN += 1;
    resetGame();
  }

  const handleLast = () => {
    game.winner = false;
    MATCHN = 6;
    resetGame();
  }

  useEffect(() => {
    return () => {
      x=0;
      for (let i = 1; i <= 4; i++) {
        localStorage.removeItem('alias'+i);
        }
      players= [];
      matches = [];
      MATCHN  = 0;
      tournOver = false;
      totOver = false;
    };
  }, []);

  return (
    <div className="canvas">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      {game.winner && tournOver != true  && (
        <div class="alert alert-primary" role="alert" style={{ position: 'absolute', top: '40%', left: '50%', textAlign: 'center', width: 'fit-content', transform: 'translateX(-50%)' }}>
          Round Winner : {game.winnerN} 
          <button type="button" class="btn btn-primary"onClick={handleMatch}>Next Match :{matches[MATCHN + 1][0]} vs {matches[MATCHN + 1][1]}</button>
        </div>
      )}
      {tournOver && totOver &&(
        <div class="alert alert-primary" role="alert" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)' }}>
        {game.winnerN} is the tournament Winner ! <a href="/modepong" class="alert-link">Back</a> 
      </div>
      )}
      {tournOver && totOver == false && MATCHN != 6 && (
              <div class="alert alert-primary" role="alert" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)' }}>
                DRAW !
                <button onClick={handleLast}>Final Round :{matches[6][0]} vs {matches[6][1]}</button>
              </div>
      )}
      <div className="scorej1">{game.player.name} : {game.player.score}</div>
      <div className="scorej2">{game.computer.name} : {game.computer.score}</div>
      <button id="featureB" className="Feature" onClick={handleFeature}>Feature ON/OFF</button>
      <button id="play" className="play" onClick={handlePlay}>Play!</button>
      {/* gestion rectangles aff tournoi
      L ENFER EST PRESENT*/}
      <div style={{position: 'absolute', left: '150px', top: '100px'}}>
        <div style={{width: '150px', height: '75px', backgroundColor: 'rgba(255, 255, 255, 0)', border: '1px solid black', marginBottom: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[0][0]} : {matches[0][2]}</div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}> Vs </div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[0][1]} : {matches[0][3]}</div>
        </div>
        <div style={{width: '150px', height: '75px', backgroundColor: 'rgba(255, 255, 255, 0)', border: '1px solid black', marginBottom: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[1][0]} : {matches[1][2]}</div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}> Vs </div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[1][1]} : {matches[1][3]}</div>
        </div>
        <div style={{width: '150px', height: '75px', backgroundColor: 'rgba(255, 255, 255, 0)', border: '1px solid black', marginBottom: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[2][0]} : {matches[2][2]}</div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}> Vs </div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[2][1]} : {matches[2][3]}</div>
        </div>
        <div style={{width: '150px', height: '75px', backgroundColor: 'rgba(255, 255, 255, 0)', border: '1px solid black', marginBottom: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[3][0]} : {matches[3][2]}</div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}> Vs </div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[3][1]} : {matches[3][3]}</div>
        </div>
        <div style={{width: '150px', height: '75px', backgroundColor: 'rgba(255, 255, 255, 0)', border: '1px solid black', marginBottom: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[4][0]} : {matches[4][2]}</div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}> Vs </div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[4][1]} : {matches[4][3]}</div>
        </div>
        <div style={{width: '150px', height: '75px', backgroundColor: 'rgba(255, 255, 255, 0)', border: '1px solid black', marginBottom: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[5][0]} : {matches[5][2]}</div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}> Vs </div>
          <div style={{textAlign: 'center', fontSize: '16px', color: 'black'}}>{matches[5][1]} : {matches[5][3]}</div>
        </div>
      </div>
    </div>
  );
}
export default TournamentPong;