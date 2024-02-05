import React from 'react';
import '../pages/Login42.css';
import Img from '../assets/3.png';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import useUser from '../hooks/useUserStorage';
/*import 'mdbreact/dist/css/mdb.css';*/


const LoginAuthorize = () => {
    const user = useUser("user");

    const handleLogin = async () => {
	const {hostname, port} = document.location
	    console.log("Clique sur le bouton de connexion");
        try {
	    
            const { protocol, hostname, port } = window.location;
	    
	    const responseUrl = await axios.post(`${protocol}//${hostname}:8080/api/auth/`, {}, {
		method: "POST",
                headers: {
			'Authorization': `Bearer ${user.get("jwt_token")}`,
                    	'Content-Type': 'application/json',
                },
            });

            console.log('Réponse du backend :', responseUrl);
            console.log('URL d\'authentification 42 générée :', responseUrl.data.authorization_url);

            if (responseUrl.data.authorization_url){
		//    navigate(responseUrl.data.authorization_url);
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
      <button className="login-button" onClick={handleLogin}>Login</button>
  );
};

export default LoginAuthorize;
