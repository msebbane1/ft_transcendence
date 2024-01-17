import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login42 from './components/Login42';
import PongGame from './pages/PongGame';
import Chat from './pages/Chat';
import Home from './pages/Home2';
import Settings from './pages/Settings';
import Profil from './pages/Profil2';
import Navbar from './components/Navbar2';
import Logout from './pages/Logout';
import CallbackPage from './components/CallbackPage';
import useUser from './hooks/useUserStorage';
import { ImageProvider } from './context/ImageContext';
//import './styles.css';


const PublicRoute = ({children}: {children: JSX.Element}) => {
	const user = useUser("user");
	const navigate = useNavigate();

	useEffect(() => {
		if (user.has("access_token"))
			navigate("/home");
	}, [])

	return <>{children}</>;
}

// verifier pour la premiere authentification ? A modifier pour le localstorage
const PrivateRoute = ({ children }: {children: JSX.Element}) => {
  const user = useUser("user");
  const navigate = useNavigate();
	console.log("session user: ", user.has("access_token"));
	useEffect(() => {
		if (!user.has("access_token"))
			navigate("/");
	}, [])

	return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
    <ImageProvider>
      <div className="site-background">
      <Routes>
	<Route path="/" element={<PublicRoute><div><Login42 /></div></PublicRoute>} />
	<Route path="/callback" element={<CallbackPage />} />
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

