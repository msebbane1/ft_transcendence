import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';
import './loading.css';

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
	  const data = response.data;
	  console.log("!all data response:", data);

          const accessToken = response.data.access_token;
          user.setAll(data);
         console.log("token1:", accessToken);

        })
        .catch((error) => {
          console.error('Error while fetching access token:', error);
        });
    } else {
      console.error('No code parameter found in the URL.');
    }
  }, [user]);

  
  useEffect(() => { 
    const twofactorauth = !user.get("2FA_status");
    const connected = user.has("access_token");
    console.log("2FA : ", twofactorauth);
    console.log("2FA activate status BEFORE : ", user.get("2FA_activate"));
    //console.log("2FA activate status AFTER", user.get("2FA_activate"));
    console.log("2FA Secret =", user.get("2FA_secret"));
    console.log("first BEFORE=", user.get("first_access"));
    console.log("test data 2FA = ", user.get("request_token"));



    if (connected && twofactorauth) {
	const first_connect = user.get("first_access");
	
	setTimeout(() => {
		if (first_connect){
			user.set("first_access", false);
			console.log("first AFTER=", user.get("first_access"));
			navigate("/settings");
		}
		else
			navigate("/home");
	}, 500)
    }

    if (connected && !twofactorauth) {
      navigate("/2fa");
    }
  }, [user]);

  return (
    <div class="loading-auth">
      <p class="loading-text">Authentification en cours...</p>
    </div>
  );
};

export default CallbackPage;