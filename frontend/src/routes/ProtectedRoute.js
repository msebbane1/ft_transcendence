import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { RedirectPrivate } from '../components/RedirectApp';
import axios from 'axios';
import useUser from '../hooks/useUserStorage';

const ProtectedRoute = ({ children }) => {
	const user = useUser("user");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  

  const handleLoadingFinish = () => {
    setLoading(false);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = user.has("access_token") || user.get("register");

        if(authenticated){
          setAuthenticated(true);
          console.log("authenticated");
          handleLoadingFinish();
        }
        else{
        navigate('/');
        console.log("jwt token invalide");
        handleLoadingFinish();
        }
    };
    checkAuthentication();

  }, [navigate, user, handleLoadingFinish]);


  return (
    <>
      {authenticated && <RedirectPrivate user={user} onLoadingFinish={handleLoadingFinish} /> }
      {loading ? (
        <div>Loading...</div>
      ) : (
        children
      )}
    </>
  );
};

export default ProtectedRoute;
