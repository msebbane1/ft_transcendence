import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Game from './pages/Game';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import './styles.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = true; // A CHANGER selon l'authentification API
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute><Login /></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><Navbar /><Home /></PrivateRoute>} />
        <Route path="/game" element={<PrivateRoute><Navbar /><Game /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Navbar /><Chat /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

