import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const PublicRoute = ({children}: {children: JSX.Element}) => {
        const user = useUser("user");
        const navigate = useNavigate();

        useEffect(() => {
		//const two_factor_auth_activate = user.get("status_2FA")
                //if (user.has("access_token") && two_factor_auth_activate == false)
		const challenge = !user.get("status_2FA") || user.get("2FA_challenge");
		if (challenge && user.has("access_token"))
			navigate("/home");
        }, [])

        return <>{children}</>;
}

export default PublicRoute;
