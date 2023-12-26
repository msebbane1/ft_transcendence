// settings.js
import React from 'react';
import './Profil.css';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div>
      <div className="container-grid">
        <Link to="/leaderboard" className="container container-1">
          Change Avatar
        </Link>
        <Link to="/watch" className="container container-2">
          Change Username
        </Link>
        <Link to="/chat" className="container container-3">
          Change Color
        </Link>
    </div>
</div>
  );
}

export default Settings;

