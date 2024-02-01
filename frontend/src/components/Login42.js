import React from 'react';
import './Login42.css';
import Img from '../assets/3.png';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
/*import 'mdbreact/dist/css/mdb.css';*/


const Login42 = () => {
    const handleLogin = async () => {
	const {hostname, port} = document.location
        try {
	    
            const { protocol, hostname, port } = window.location;
            const backendUrl = `${protocol}//${hostname}:8080/api/auth/`;

            const responseUrl = await axios.get(backendUrl);
            // A MODIFIER EN POST
            /*const responseUrl = await axios.get('https://localhost:8080/api/auth/');
	    
	   /* const responseUrl = await axios.post('http://localhost:8080/auth/', {}, {
		method: "POST",
                headers: {
			'Authorization': `Bearer ${session.get("request_token")}`,
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
   <div className="container-login animate__bounceIn">
    <div className="text-container">
	<p><span class="text-pong">pong</span><span class="text-game">Game</span> 
	</p>
      </div>
	<div className="container_ft"> 
        <p><span className="text-ft2">  &gt;</span><span className="text-ft">  ft_transcendence/pongGame</span>
	</p>
	</div>
      <button className="login-button" onClick={handleLogin}>Login</button>
   </div>
  );
};

export default Login42;
