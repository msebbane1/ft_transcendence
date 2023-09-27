import React from 'react';
import './Login42.css';
import Img from '../assets/3.png'

const Login42 = () => {
  const handleLoginWith42 = () => {
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0eb1371b71fe5c6a555fd5eb1d7e9e369041aae68a8f326cd93b1f6b8b167b54&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code`;
  }; // A METTRE DANS .ENV CLIENT_ID et REDIRECT URL

  return (
    <div>
      <img
      src={Img}
      alt="Nom de l'image"
      className="centered-image"
    />
      <button onClick={handleLoginWith42}>42 Login</button>
    </div>
  );
};

export default Login42;

