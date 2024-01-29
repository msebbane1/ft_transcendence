// TwoFAuthRoute.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const TwoFAuthRoute = ({ children }) => {
  const user = useUser("user");
  const navigate = useNavigate();

  useEffect(() => {
    const twofactorauth = !user.get("2FA_status");
    const connected = user.has("access_token");

    if (connected && twofactorauth) {
      const first_connect = user.get("first_access");

      setTimeout(() => {
        if (first_connect) {
          user.set("first_access", false);
          navigate("/settings");
        } else {
          navigate("/home");
        }
      }, 500);
    }

    if (connected && !twofactorauth) {
      navigate("/2fa");
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default TwoFAuthRoute;

