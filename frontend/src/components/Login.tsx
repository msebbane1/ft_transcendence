// Login.tsx
// A CHANGER pour les redirections TEST
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === "root" && password === "root") {
      navigate("/home");
    } else {
      console.error("La connexion a échoué. Veuillez vérifier vos informations de connexion.");
	// Creer effet ajout d'erreur
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
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
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
};

export default Login;

