import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const CallbackPage = () => {
  const user = useUser("user");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const { protocol, hostname, port } = window.location;

    console.log('Code received:', code);

    if (code && !user.has("access_token")) {
      const tokenUrl = `${protocol}//${hostname}:8080/api/auth/callback/`;
      //const tokenUrl = 'https://localhost:8080/api/auth/callback/';

      axios
        .post(
          tokenUrl,
          { code },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        )
        .then((response) => {
          const accessToken = response.data.access_token;

          // Utilisation de setAll pour mettre à jour plusieurs valeurs dans la session
          user.setAll({ access_token: accessToken });
          console.log("token1:", accessToken);
	  console.log("tokendata:", response.data.access_token);
        })
        .catch((error) => {
          console.error('Error while fetching access token:', error);
        });
    } else {
      console.error('No code parameter found in the URL.');
    }
  }, [user]);

	//FAIRE 2FA
  useEffect(() => {
    const twofactorauth = !user.get("2FA_status") || user.get("2FA_challenge");
    const connected = user.has("access_token");
    console.log("2FA : ", twofactorauth);
    console.log("2FA status", user.has("2FA_status"));
    console.log("2FA challenge", user.has("2FA_challenge"));

    if (connected && twofactorauth) {
      setTimeout(() => {
        //document.location.href = `http://localhost:3000/home`;
	navigate("/home");
      }, 500);
    }

    if (connected && !twofactorauth) {
      document.location.href = `http://localhost:3000/2fa`;
    }
  }, [user]);

  return (
    <div>
      <p>Authentification en cours...</p>
    </div>
  );
};

export default CallbackPage;
