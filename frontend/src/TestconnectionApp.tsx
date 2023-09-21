import React, { useState } from "react";

// Composant de la page du tableau de bord
function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div>
      <h1>Tableau de bord</h1>
      <button onClick={onLogout}>Déconnexion</button>
    </div>
  );
}

// Composant de la page de connexion
function Login({ onLogin }: { onLogin: () => void }) {
  const handleLogin = () => {
    // Simuler une authentification réussie ici
    onLogin(); // Cela appelle la fonction onLogin passée en tant que prop
  };

  return (
    <div>
      <h1>Connexion</h1>
      <button onClick={handleLogin}>Connexion</button>
    </div>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  // Fonction appelée lors de la connexion réussie
  const onLogin = () => {
    // Votre logique d'authentification réussie ici
    // Par exemple, vous pourriez vérifier les informations d'identification,
    // obtenir un jeton d'authentification, etc.

    // Une fois l'authentification réussie, mettez à jour l'état pour indiquer
    // que l'utilisateur est connecté.
    setAuthenticated(true);
  };

  // Fonction appelée lors de la déconnexion
  const onLogout = () => {
    // Votre logique de déconnexion ici
    // Par exemple, vous pourriez invalider les jetons d'authentification,
    // supprimer la session, etc.

    // Une fois la déconnexion réussie, mettez à jour l'état pour indiquer
    // que l'utilisateur est déconnecté.
    setAuthenticated(false);
  };

  return (
    <div>
      <h1>Mon Application</h1>
      {authenticated ? (
        <Dashboard onLogout={onLogout} />
      ) : (
        <Login onLogin={onLogin} />
      )}
    </div>
  );
}

export default App;

