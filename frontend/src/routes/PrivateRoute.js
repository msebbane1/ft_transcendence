import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const PrivateRoute = ({ children }: {children: JSX.Element}) => {
  const user = useUser("user");
  const navigate = useNavigate();
  console.log("session user: ", user.has("access_token"));

        useEffect(() => {
                //if (user.has("access_token"))
		//{
		     //const two_factor_auth_activate = user.get("2FA_status")
		     //if (two_factor_auth_activate == true)
		//	navigate("/2fa");
		//}
               // if(!user.has("access_token"))
		//	navigate("/");
		if (user.has("access_token"))
		{
			const challenge = !user.get("status_2FA") || user.get("2FA_challenge");
			console.log("challenge routes :", challenge);
			if (!challenge)	navigate("/2FA");
		}
		else navigate("/");
        }, [])

        return <>{children}</>;
}

export default PrivateRoute;
