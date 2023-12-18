import axios from 'axios';
import { useEffect } from 'react';
import useSession from './useSession';

const CallbackPage2 = () => {
  const session = useSession("session");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('Code received:', code);

    if (code && !session.has("access_token")) {
      const tokenUrl = 'http://localhost:8080/auth/callback/';

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
          session.setAll({ access_token: accessToken });
        })
        .catch((error) => {
          console.error('Error while fetching access token:', error);
        });
    } else {
      console.error('No code parameter found in the URL.');
    }
  }, [session]); // Ajout de la dépendance "session" pour éviter les avertissements liés aux Hooks

  useEffect(() => {
    const { hostname, port } = document.location;
    const challenge = !session.get("2FA_status") || session.get("2FA_challenge");
    const connected = session.has("access_token");

    if (connected && challenge) {
      let first = session.get("first_access") === "true";
      setTimeout(() => {
        session.set("first_access", "false");
        if (first) document.location.href = `http://${hostname}:${port}/settings`;
        else document.location.href = `http://${hostname}:${port}/home`;
      }, 500);
    }

    if (connected && !challenge) {
      document.location.href = `http://${hostname}:${port}/2fa`;
    }
  }, [session]);

  return (
    <div>
      <p>Authentification en cours...</p>
    </div>
  );
};

export default CallbackPage2;

