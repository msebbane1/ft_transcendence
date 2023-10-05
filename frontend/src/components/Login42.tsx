import React from 'react';
import './Login42.css';
import Img from '../assets/3.png';

const generateAuthorizationUrl = () => {
  const { REACT_APP_CLIENT_ID, REACT_APP_REDIRECT_URI } = process.env;
  const baseAuthUrl = 'https://api.intra.42.fr/oauth/authorize';

  if (!REACT_APP_CLIENT_ID || !REACT_APP_REDIRECT_URI) {
    throw new Error('REACT_APP_CLIENT_ID and REACT_APP_REDIRECT_URI must be defined in your environment.');
  }

  const queryParams = new URLSearchParams({
    client_id: REACT_APP_CLIENT_ID,
    redirect_uri: REACT_APP_REDIRECT_URI,
    response_type: 'code',
  });

  return `${baseAuthUrl}?${queryParams.toString()}`;
};

const Login42 = () => {
  const handleClickLogin = () => {
    const authorizationUrl = generateAuthorizationUrl();
    window.location.href = authorizationUrl;
  };

  return (
    <div>
    <div className="text-container">
	<p className="text-pong"> pong </p>
	<p className="text-game"> Game </p>
      </div>
	<div className="container_ft"> 
        <p className="text-ft2"> &gt; </p> <p className="text-ft"> ft_transcendence/pongGame </p>
	</div>
	<p className="italic-text">
	   Ce project consiste à créer un site web pour <br />
	   participer à une compétition du célèbre jeu Pong !
	</p>
      <button className="login-button" onClick={handleClickLogin}>Login</button>
      </div>
  );
};

export default Login42;

