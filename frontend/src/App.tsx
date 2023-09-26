import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login42 from './components/Login42';
import Game from './pages/Game';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import CallbackPage from './CallbackPage'; // Importez votre composant CallbackPage
import './styles.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const isAuthenticated = async () => {
  try {
    // Effectuez une requête d'authentification à l'API 42
    const response = await fetch('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0eb1371b71fe5c6a555fd5eb1d7e9e369041aae68a8f326cd93b1f6b8b167b54&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code', {
      method: 'POST',
      // Ajoutez les en-têtes et le corps de la requête selon les besoins
    });

    if (response.status === 200) {
      return true; // Authentification réussie
    } else {
      return false; // Échec de l'authentification
    }
  } catch (error) {
    console.error(error);
    return false; // Erreur lors de l'authentification
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
        <Route path="/callback" element={<CallbackPage />} /> {/* Nouvelle route pour le CallbackPage */}
        <Route path="/home" element={<PrivateRoute><Navbar /><Home /></PrivateRoute>} />
        <Route path="/game" element={<PrivateRoute><Navbar /><Game /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Navbar /><Chat /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

