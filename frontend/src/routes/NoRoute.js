import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const NoRoute = ({ children }: {children: JSX.Element}) => {

        const user = useUser("user");
        const navigate = useNavigate();
        console.log("session user: ", user.has("access_token"));
        useEffect(() => {
                if (user.has("access_token"))
                        navigate("/home");
                else
                        navigate("/");
        }, [])

        return <></>;
}

export default NoRoute;
