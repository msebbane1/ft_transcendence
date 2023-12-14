import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login42 from './components/Login42';
import PongGame from './pages/PongGame';
import Chat from './pages/Chat';
import Home from './pages/Home2';
import Profil from './pages/Profil';
import Navbar from './pages/Navbar';
import CallbackPage from './CallbackPage';
import useSession2 from './useSession2';
import { ImageProvider } from './ImageContext';
import { useLocalStorage } from './useLocalStorage';
//import './styles.css';

/*
const PublicRoute = ({children}: {children: JSX.Element}) => {
	const session = useSession2("session");
	const navigate = useNavigate();

	useEffect(() => {
		//let challenge = !session.get("2FA_status") || session.get("2FA_challenge");
		if (session.has("accessToken"))
			navigate("/home");
	}, [])

	return <>{children}</>;
}*/
 // A MODIFIER CREER un hook pour le localstorage (la redirection fonctionne tout le temps meme deconnecter (cause  token))
const PublicRoute = ({children}: {children: JSX.Element}) => {
        //const isAuthenticated = !!localStorage.getItem('accessToken');
	const [isAuthenticated] = useLocalStorage('accessToken', false);
        const navigate = useNavigate();

        useEffect(() => {
                //let challenge = !session.get("2FA_status") || session.get("2FA_challenge");
                if (isAuthenticated)
                      navigate("/home");
        }, [])

        return <>{children}</>;
}

// verifier pour la premiere authentification ? A modifier pour le localstorage
const PrivateRoute = ({ children }: {children: JSX.Element}) => {
  //const isAuthenticated = !!localStorage.getItem('accessToken');
  const [isAuthenticated] = useLocalStorage('accessToken', false);
  const navigate = useNavigate();

  useEffect(() => {
  	if (!isAuthenticated) {
    		navigate("/");
  	}
  }, [isAuthenticated, navigate])

   return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
    <ImageProvider>
      <div className="site-background">
      <Routes>
	<Route path="/" element={<PublicRoute><div>Login42 /></div></PublicRoute>} />
 	<Route path="/callback/" element={<CallbackPage />} />
        <Route path="/home" element={<PrivateRoute><div><Navbar /><Home /></div></PrivateRoute>} />
	<Route path="/play" element={<PrivateRoute><div><Navbar /><PongGame /></div></PrivateRoute>} />
	<Route path="/chat" element={<PrivateRoute><div><Navbar /><Chat /></div></PrivateRoute>} />
	<Route path="/profile" element={<PrivateRoute><div><Navbar /><Profil /></div></PrivateRoute>} />
      </Routes>
	</div>
    </ImageProvider>
    </BrowserRouter>
  );
}

export default App;

