import React from 'react';
import './Login42.css';
import Img from '../assets/3.png';
import axios from 'axios';

const Login42 = () => {
    const handleLogin = async () => {
	const {hostname, port} = document.location
        try {
	    
            const { protocol, hostname, port } = window.location;
            const backendUrl = `${protocol}//${hostname}:8080/api/auth/`;

            const responseUrl = await axios.get(backendUrl);
            // A MODIFIER EN POST
            //const responseUrl = await axios.get('https://localhost:8080/api/auth/');
	    /*
	    const responseUrl = await axios.post('http://localhost:8080/auth/', {}, {
		method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
            });*/
            console.log('Réponse du backend :', responseUrl);
            console.log('URL d\'authentification 42 générée :', responseUrl.data.authorization_url);

            if (responseUrl.data.authorization_url){
                document.location.href = responseUrl.data.authorization_url;
            }
            else {
                console.log('Réponse URL', responseUrl.data);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification 42 LOGIN:', error);
        }
    };

  return (
    <body className="back">
    <div className="text-container">
	<p className="text-pong"> pong</p>
	<p className="text-game"> Game </p>
      </div>
	<div className="container_ft"> 
        <p className="text-ft2">  &gt; </p> <p className="text-ft">  ft_transcendence/pongGame </p>
	</div>
      <button className="login-button" onClick={handleLogin}>Login</button>
      </body>
  );
};

export default Login42;
