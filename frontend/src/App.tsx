import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login42 from './components/Login42';
import Game from './pages/Game';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import CallbackPage from './CallbackPage';
import './styles.css';
//import ParticlesBackground from './components/ParticlesBackground'; A CHANGER

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const isAuthenticated = async () => {
  try {
    const response = await fetch('${API_42}', {
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
        <Route path="/" element={<PrivateRoute><Login42 /></PrivateRoute>} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/home" element={<PrivateRoute><Navbar /><Home /></PrivateRoute>} />
        <Route path="/game" element={<PrivateRoute><Navbar /><Game /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Navbar /><Chat /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

