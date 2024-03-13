import React from 'react';
import '../pages/Login42.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';


const LoginAuthorizeUrl = () => {

    const { protocol, hostname} = window.location;

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${protocol}//${hostname}:8080/api/auth/authorize-url-42/`, {}, {
		        method: "POST",
                headers: {
                    	'Content-Type': 'application/json',
                },
            });
            //console.log('URL d\'authentification 42 générée :', response.data.authorization_url);

            if (response.data.authorization_url){
                window.location.href = response.data.authorization_url;
            }
            else {
                console.log('Response URL', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification 42 LOGIN:', error);
        }
    };

  return (
      <button className="login-button" onClick={handleLogin}>Login</button>
  );
};

export default LoginAuthorizeUrl;
