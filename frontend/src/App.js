import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login42 from './components/Login42';
import PongGame from './pages/PongGame';
import Home from './pages/Home';
import TwoFA from './pages/2FA';
import Settings from './pages/Settings';
import Profil from './pages/Profil';
import Navbar from './components/Navbar';
import CallbackPage from './components/CallbackPage';
import useUser from './hooks/useUserStorage';
/*import { ImageProvider } from './context/ImageContext';*/
// ROUTES
import NoRoute from './routes/NoRoute';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
/*import './global.css';*/
import 'bootstrap/dist/css/bootstrap.min.css';
//import TwoFAuthRoute from './routes/TwoFAuthRoute';


function App() {
const backgroundStyle = {
    background: 'url("./fond2.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    overflow: 'hidden',
  };
  return (
    <BrowserRouter>
      <div className="container-fluid" style={backgroundStyle}>
      <Routes>
	<Route path="/" element={<PublicRoute><div><Login42 /></div></PublicRoute>} />
	<Route path="/callback" element={<CallbackPage />} />
	<Route path="/2fa" element={<PublicRoute><div><TwoFA /></div></PublicRoute>} />
        <Route path="/home" element={<PrivateRoute><div><Navbar /><Home /></div></PrivateRoute>} />
	<Route path="/play" element={<PrivateRoute><div><Navbar /><PongGame /></div></PrivateRoute>} />
	<Route path="/settings" element={<PrivateRoute><div><Navbar /><Settings /></div></PrivateRoute>} />
	<Route path="/profile" element={<PrivateRoute><div><Navbar /><Profil /></div></PrivateRoute>} />
	<Route path="*" element={<NoRoute />} />
      </Routes>
	</div>
    </BrowserRouter>
  );
}

export default App;

