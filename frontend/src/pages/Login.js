import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';
import './loading.css';
import './Login42.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import SignInModals from '../modals/SignInModals';
import { handleAuthentification42 } from '../components/LoginHandleAuth42';

const LoginPage = () => {
  const user = useUser("user");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 //Set toute les infos dans user
  useEffect(() => {
    handleAuthentification42(user, setLoading);
  }, []);

  useEffect(() => { 
    const code2FA_is_activate = user.get("status_2FA");
    const connected = user.has("access_token");
    const code2FA_is_valid = user.get("2FA_valid");
    const not_2FA = !code2FA_is_activate || code2FA_is_valid;
    
    console.log("2FA auth: ", not_2FA);
    console.log("2FA Secret =", user.has("2FA_secret"));
    console.log("1ere connection :", user.get("first_access"));
    console.log("User connected :", user.has("access_token"));

    if (connected && not_2FA){
	        setTimeout(() => {
		          navigate("/home");
	        }, 1000)
    }

    if (connected && !not_2FA) {
      	navigate("/2fa");
    }
  }, [user]);

return (
    <div>
      {loading ? (
        <div className="loading-auth">
          <p className="loading-text">Authentification en cours...</p>
        </div>
      ) : (
        <div className="container-login animate__bounceIn">
          <div className="text-container">
            <p>
              <span className="text-pong">pong</span>
              <span className="text-game">Game</span>
            </p>
          </div>
          <div className="container_ft">
            <p>
              <span className="text-ft2"> &gt;</span>
              <span className="text-ft"> ft_transcendence/pongGame</span>
            </p>
          </div>
          <SignInModals />
	 
        </div>
      )}
    </div>
  );
};

export default LoginPage;
