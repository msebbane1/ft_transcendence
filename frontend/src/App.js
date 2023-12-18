import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login42 from './components/Login42';
import PongGame from './pages/PongGame';
import Chat from './pages/Chat';
import Home from './pages/Home2';
import Profil from './pages/Profil';
import Navbar from './pages/Navbar';
import Logout from './pages/Logout';
import CallbackPage from './CallbackPage2';
import useSession from './useSession';
import { ImageProvider } from './ImageContext';
//import './styles.css';


const PublicRoute = ({children}: {children: JSX.Element}) => {
	const session = useSession("session");
	const navigate = useNavigate();

	useEffect(() => {
		if (session.has("access_token"))
			navigate("/home");
	}, [session])

	return <>{children}</>;
}

// verifier pour la premiere authentification ? A modifier pour le localstorage
const PrivateRoute = ({ children }: {children: JSX.Element}) => {
  const session = useSession("session");
  const navigate = useNavigate();
	console.log("session: ", session.has("access_token"));
	useEffect(() => {
		if (!session.has("access_token"))
			navigate("/");
	}, [session])

	return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
    <ImageProvider>
      <div className="site-background">
      <Routes>
	<Route path="/" element={<PublicRoute><div><Login42 /></div></PublicRoute>} />
 	<Route path="/callback/" element={<CallbackPage />} />
        <Route path="/home" element={<PrivateRoute><div><Navbar /><Home /></div></PrivateRoute>} />
	<Route path="/play" element={<PrivateRoute><div><Navbar /><PongGame /></div></PrivateRoute>} />
	<Route path="/chat" element={<PrivateRoute><div><Navbar /><Chat /></div></PrivateRoute>} />
	<Route path="/profile" element={<PrivateRoute><div><Navbar /><Profil /></div></PrivateRoute>} />
	<Route path="/logout" element={<PrivateRoute><div><Navbar /><Logout /></div></PrivateRoute>} />
      </Routes>
	</div>
    </ImageProvider>
    </BrowserRouter>
  );
}

export default App;

