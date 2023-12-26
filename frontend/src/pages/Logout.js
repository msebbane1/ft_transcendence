import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const Logout = () => {
  const user = useUser("user");
  const navigate = useNavigate();

  const handleLogout = () => {
     user.clear()
     setTimeout(() => navigate("/"), 500)
  };

  return (
    <div>
      <h2>Page de Déconnexion</h2>
      <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default Logout;

