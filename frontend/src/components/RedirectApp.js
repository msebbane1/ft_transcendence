import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const RedirectPrivate = ({ user, onLoadingFinish }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authenticated = user.has("access_token") || user.get("register");
    const code2FA_is_activate = user.get("status_2FA");
    const code2FA_is_valid = user.get("2FA_valid");
    const not_2FA = !code2FA_is_activate || code2FA_is_valid;

    const checkAuthentication = async () => {
    try {
        const response = await axios.post(
          `https://localhost:8080/api/auth/get-tokenjwtCookies/${user.get("id")}/`, {},{}
        );

    if (authenticated && response.data) {
      console.log("jwt token valide");
      if (!not_2FA) 
        navigate("/2FA");
    } 
    else 
      navigate("/");

    } catch (error) {
      navigate('/');
      console.log("jwt token invalide or not authenticated");
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
    const code2FA_is_activate = user.get("status_2FA");
    const code2FA_is_valid = user.get("2FA_valid");
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
    const code2FA_is_activate = user.get("status_2FA");
    const code2FA_is_valid = user.get("2FA_valid");
    const not_2FA = !code2FA_is_activate || code2FA_is_valid;
    
    //console.log("2FA auth: ", not_2FA);
    //console.log("2FA Secret =", user.has("2FA_secret"));
    //console.log("1ere connection :", user.get("first_access"));
    //console.log("User connected :", user.has("access_token"));

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
      console.log("pongAccess:", pongAccess);
      console.log("pongAccess:", endpong);
      if (endpong === "fin" || !pongAccess) {
        console.log("pongAccessentrer:", pongAccess);
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