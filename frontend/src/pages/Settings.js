import React, { useState } from 'react';

const SettingsPage = () => {
  const [isTwoFactorAuthEnabled, setTwoFactorAuth] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [userName, setUserName] = useState('');
  const [textColor, setTextColor] = useState('white');

  const handleToggleTwoFactorAuth = () => {
    setTwoFactorAuth((prev) => !prev);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    console.log('Nouvelle photo de profil :', file);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const textStyle = { color: textColor }; // Style pour appliquer la couleur du texte

  return (
    <div>
      <h2 style={textStyle}>Paramètres</h2>

      <div>
        <label style={textStyle}>
          Activer la double authentification (2FA):
          <input
            type="checkbox"
            checked={isTwoFactorAuthEnabled}
            onChange={handleToggleTwoFactorAuth}
          />
        </label>
      </div>

      <div>
        <label style={textStyle}>
          Changer la photo de profil:
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
        </label>
      </div>

      <div>
        <label style={textStyle}>
          Changer le nom d'utilisateur:
          <input type="text" value={userName} onChange={handleUserNameChange} />
        </label>
      </div>

      <div>
        <label style={textStyle}>
          Changer la couleur du texte:
          <input type="color" value={textColor} onChange={handleTextColorChange} />
        </label>
        <p style={textStyle}>Exemple de texte avec la nouvelle couleur</p>
      </div>
    </div>
  );
};

export default SettingsPage;

