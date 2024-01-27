import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const PublicRoute = ({children}: {children: JSX.Element}) => {
        const user = useUser("user");
        const navigate = useNavigate();

        useEffect(() => {
		const two_factor_auth_is_activate = user.get("status_2FA");
		const two_factor_auth_is_valid = user.get("2FA_valid");
                //if (user.has("access_token") && two_factor_auth_activate == false)
		const not_2FA = !two_factor_auth_is_activate || two_factor_auth_is_valid;
		if (user.has("access_token") && not_2FA)
			navigate("/home");
        }, [])

        return <>{children}</>;
}

export default PublicRoute;
