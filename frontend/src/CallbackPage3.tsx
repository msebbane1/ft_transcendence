import React, { useEffect } from 'react';
import axios from 'axios';
//import useSession2 from './useSession2';
//import { REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET, REACT_APP_API_URL, REACT_APP_REDIRECT_URI } from './config';

const CallbackPage3 = () => {

//const session = useSession2("session");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const tokenUrl = `${process.env.REACT_APP_API_URL}/oauth/token`;

      axios
        .post(tokenUrl, null, {
          params: {
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
            code: code,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI,
            grant_type: 'authorization_code',
          },
        })
        .then((response) => {
          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          const accessToken = localStorage.getItem("accessToken");

	if (accessToken) {
  	console.log("AccessToken:", accessToken); //j'bbtient bien le token ICI
	} else {
  	console.log("PTESSSTas de jeton d'accès trouvé.");
	}
          const isAuthenticated = !!localStorage.getItem('accessToken');
	  //session.set({ accessToken });
          if (isAuthenticated) {
            window.location.href = '/home';
          }
        })
        .catch((error) => {
          console.error('Error exchanging code for access token:', error);
        });
    }
  }, []);

  return (
    <div>
      <p>Authentification en cours...</p>
    </div>
  );
};

export default CallbackPage3;

