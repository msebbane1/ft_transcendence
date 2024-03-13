import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const RedirectPrivate = ({ user, onLoadingFinish }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authenticated = user.has("access_token") || user.get("register");
    const code2FA_is_activate = user.get("status2FA");
    const code2FA_is_valid = user.get("2FAValid");
    const not_2FA = !code2FA_is_activate || code2FA_is_valid;

    const checkAuthentication = async () => {
    try {
        const response = await axios.post(
          `https://localhost:8080/api/auth/get-tokenjwtCookies/${user.get("id")}/`, {},{}
        );

    if (authenticated && response.data) {
      if (!not_2FA) 
        navigate("/2FA");
    } 
    else 
      navigate("/");

    } catch (error) {
      navigate('/');
      onLoadingFinish();
    }
  };
  checkAuthentication();
  onLoadingFinish();

  }, [user, navigate, onLoadingFinish]);

  return null;
};

export const RedirectPublic = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authenticated = user.has("access_token") || user.get("register");
    const code2FA_is_activate = user.get("status2FA");
    const code2FA_is_valid = user.get("2FAValid");
    const not_2FA = !code2FA_is_activate || code2FA_is_valid;

    if (authenticated && not_2FA)
        navigate("/home");
    }, [])

  return null;
};

export const RedirectUnknow = ({ user }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const authenticated = user.has("access_token") || user.get("register");
    
    if (authenticated)
      navigate("/home");
    else
      navigate("/");
  
    }, [])

  return null;

};

// Seulement pour User 42
export const RedirectLogin = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => { 
    const authenticated42 = user.has("access_token");
    const code2FA_is_activate = user.get("status2FA");
    const code2FA_is_valid = user.get("2FAValid");
    const not_2FA = !code2FA_is_activate || code2FA_is_valid;

    if (authenticated42 && not_2FA){
		          navigate("/home");
    }

    if (authenticated42 && !not_2FA) {
      	navigate("/2fa");
    }
  }, [user]);

  return null;
};


export const RedirectGame = ({ user, onLoadingFinish }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authenticated = user.has("access_token") || user.get("register");

    if (authenticated) {
      const pongAccess = user.has("pongAccess");
      const endpong = user.get("pongAccess");
      if (endpong === "fin" || !pongAccess) {
        navigate("/home");
      }

    } else {

      navigate("/");
    }
    onLoadingFinish();

  }, [user, navigate, onLoadingFinish]);

  return null;
};

export default RedirectGame;