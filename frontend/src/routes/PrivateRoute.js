import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const PrivateRoute = ({ children }: {children: JSX.Element}) => {
  const user = useUser("user");
  const navigate = useNavigate();
  console.log("session user has register ", user.get("register"));

        useEffect(() => {
                //if (user.has("access_token"))
		//{
		     //const two_factor_auth_activate = user.get("2FA_status")
		     //if (two_factor_auth_activate == true)
		//	navigate("/2fa");
		//}
               // if(!user.has("access_token"))
		//	navigate("/");
		if (user.has("access_token") || user.get("register"))
		{
			const challenge = !user.get("status_2FA") || user.get("2FA_valid");
			console.log("challenge routes :", challenge);
			if (!challenge)	navigate("/2FA");
		}
		else navigate("/");
        }, [])

        return <>{children}</>;
}

export default PrivateRoute;
