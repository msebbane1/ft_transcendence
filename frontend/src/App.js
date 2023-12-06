import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
//import Logintest from './Logintest';
//import LoginButton from './LoginButton';
import Login42 from './components/Login42';
import PongGame from './pages/PongGame';
import Chat from './pages/Chat';
import Home2 from './pages/Home2';
import Profil from './Profil';
import Navbar2 from './pages/Navbar2';
import CallbackPage from './CallbackPage';
import useSession2 from './useSession2';
//import _42LoginButton from './42LoginButton';
//import './styles.css';



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

/* // A MODIFIER
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const session = useSession2('session'); // Stocker elements
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


// CHANGER LA METHODE
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
      <div className="site-background">
      <Routes>
	<Route path="/" element={<Login42 />} />
 	<Route path="/callback/" element={<CallbackPage />} />
        <Route path="/home" element={<PrivateRoute><div><Navbar2 /><Home2 /></div></PrivateRoute>} />
	<Route path="/play" element={<PrivateRoute><div><Navbar2 /><PongGame /></div></PrivateRoute>} />
	<Route path="/chat" element={<PrivateRoute><div><Navbar2 /><Chat /></div></PrivateRoute>} />
	<Route path="/profile" element={<PrivateRoute><div><Profil /></div></PrivateRoute>} />
      </Routes>
	</div>
    </BrowserRouter>
  );
}

export default App;

