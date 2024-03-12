import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';
import './loading.css';
import './Login42.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import SignInModals from '../modals/SignInModals';
import { handleAuthentification42 } from '../components/LoginHandleAuth42';
import { RedirectLogin } from '../components/RedirectApp';

const LoginPage = () => {
  const user = useUser("user");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 //Set toute les infos dans user
  useEffect(() => {
    handleAuthentification42(user, setLoading);
  }, []);

  if (user.has("access_token")) {
    return <RedirectLogin user={user}/>;
  }

return (
    <div>
      {loading ? (
        <div className="loading-auth">
          <p className="loading-text">Authentification in progress...</p>
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
