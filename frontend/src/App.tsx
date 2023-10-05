import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Logintest from './Logintest';
import LoginButton from './LoginButton';
import Login42 from './components/Login42';
import Game from './pages/Game';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Profil from './Profil';
import Navbar from './pages/Navbar';
import CallbackPage3 from './CallbackPage3';
import useSession2 from './useSession2';
import './styles.css';



const PublicRoute = ({children}: {children: JSX.Element}) => {
	const session = useSession2("session");
	const navigate = useNavigate();

	useEffect(() => {
		//let challenge = !session.get("2FA_status") || session.get("2FA_challenge");
		if (session.has("accessToken"))
			navigate("/home");
	}, [])

	return <>{children}</>;
}
/*
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const session = useSession2('session');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Session content:', session);

    // Vérifie si l'utilisateur est authentifié
    if (!session.isAuthenticated()) {
      // Si non authentifié, redirigez vers la page de connexion
      navigate('/');
      console.log('test error');}
    else{
 	navigate('/home');
    }
  }, [session, navigate]);

  return <>{children}</>;
};*/



const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const isAuthenticated = async () => {
    try {
      const response = await fetch('process.env.REACT_APP_REDIRECT_URI', {
        method: 'POST',
      });

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login42 />} />
 	<Route path="/callback" element={<CallbackPage3 />} />
        <Route path="/home" element={<PrivateRoute><div><Navbar /><Home /></div></PrivateRoute>} />
	<Route path="/game" element={<PrivateRoute><div><Navbar /><Game /></div></PrivateRoute>} />
	<Route path="/chat" element={<PrivateRoute><div><Navbar /><Chat /></div></PrivateRoute>} />
	<Route path="/profile" element={<PrivateRoute><div><Profil /></div></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

