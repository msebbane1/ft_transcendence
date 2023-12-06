import axios from 'axios';
import { useEffect } from 'react';

// Rajouter .dotenv pour localhost
const CallbackPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('Code received:', code);

    if (code) {
      const tokenUrl = 'http://localhost:8080/auth/callback/';

      axios
        .post(
          tokenUrl,
          { code },
          {
	    method: 'POST',
            headers: {
              'Content-Type': 'application/json', // A RAJOUTER COOKIES BACK + FRONT
            },
	  timeout: 5000
          }
      )
        .then((response) => {
          const access_token = response.data.access_token;
          localStorage.setItem('accessToken', access_token);
	  const accessToken = localStorage.getItem('accessToken');

	  console.log('Code:', code);
	  console.log('response data: ', response.data);
	  console.log('datatoken:', response.data.access_token);

	  if (response.status >= 200 && response.status < 300) {
      		console.log("Response OK:", response);
	  }
	  if (accessToken) {
		console.log("AccessToken:", accessToken);
          }
	  else {
         	console.log("Pas de jeton d'accès trouvé.");
          }

          const isAuthenticated = !!localStorage.getItem('accessToken');
          if (isAuthenticated) {
	    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`; // A CHANGER
            window.location.href = '/home';
          }
        })
        .catch((error) => {
	    console.error('Error details:', error);
          if (error.response) {
            // La requête a été effectuée et le serveur a répondu avec un code d'erreur
            console.error('Error exchanging code for access token. Status:', error.response.status);
            console.error('Error details:', error.response.data);
          } else if (error.request) {
            // La requête a été effectuée mais aucune réponse n'a été reçue
            console.error('No response received from the server.', error);
          } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error('Error setting up the request:', error.message);
          }
        });
    } else {
      console.error('No code parameter found in the URL.');
    }
  }, []);

  return (
    <div>
      <p>Authentification en cours...</p>
    </div>
  );
};

export default CallbackPage;

