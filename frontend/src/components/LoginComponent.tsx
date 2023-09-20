// LoginComponent.tsx

import React, { useState } from 'react';

import { Navigate } from 'react-router-dom';

const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Effectuez la logique d'authentification ici (par exemple, une requête API)

    // Si l'authentification réussit, vous pouvez rediriger l'utilisateur vers la page principale
    // history.push('/home');
    return <Navigate to="/home" />
  };

  return (
    <div>
      <h2>Page de Connexion</h2>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Connexion</button>
    </div>
  );
};

export default LoginComponent;

