import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login42 from './components/Login42';
import PongGame from './pages/PongGame';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Settings from './pages/Settings2';
import TwoFA from './pages/2FA';
import Profil from './pages/Profil';
//import TwoFactorAuth from './pages/TwoFactorAuth';
import Navbar from './components/Navbar';
import Logout from './pages/Logout';
import CallbackPage from './components/CallbackPage';
import useUser from './hooks/useUserStorage';
import { ImageProvider } from './context/ImageContext';
// ROUTES
import NoRoute from './routes/NoRoute';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';


function App() {
  return (
    <BrowserRouter>
    <ImageProvider>
      <div className="site-background">
      <Routes>
	<Route path="/" element={<PublicRoute><div><Login42 /></div></PublicRoute>} />
	<Route path="/callback" element={<CallbackPage />} />
	<Route path="/2fa" element={<PublicRoute><div><TwoFA /></div></PublicRoute>} />
        <Route path="/home" element={<PrivateRoute><div><Navbar /><Home /></div></PrivateRoute>} />
	<Route path="/play" element={<PrivateRoute><div><Navbar /><PongGame /></div></PrivateRoute>} />
	<Route path="/settings" element={<PrivateRoute><div><Navbar /><Settings /></div></PrivateRoute>} />
	<Route path="/profile" element={<PrivateRoute><div><Navbar /><Profil /></div></PrivateRoute>} />
	<Route path="/logout" element={<PrivateRoute><div><Navbar /><Logout /></div></PrivateRoute>} />
	<Route path="*" element={<NoRoute />} />
      </Routes>
	</div>
    </ImageProvider>
    </BrowserRouter>
  );
}

export default App;

