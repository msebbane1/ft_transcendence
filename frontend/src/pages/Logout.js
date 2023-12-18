import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSession from '../useSession';

const Logout = () => {
  const session = useSession("session");
  const navigate = useNavigate();

  const handleLogout = () => {
     session.logout()
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

