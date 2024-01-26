import React, { useState } from 'react';
import useUser from '../hooks/useUserStorage';  // Assurez-vous de spécifier le bon chemin

const Settings = () => {
  const session = useUser("user");
  const [is2FAEnabled, setIs2FAEnabled] = useState(session.get("status_2FA"));
  console.log("2FA activate BEFORE", session.get("status_2FA"));

  const handle2FAToggle = () => {
    const newStatus = !is2FAEnabled;
    session.set("status_2FA", newStatus);
    console.log("2FA activate AFTER", session.get("status_2FA"));
    setIs2FAEnabled(newStatus);
  };

  return (
    <div>
      <h2>Paramètres</h2>
      <label>
        Activer la double authentification (2FA)
        <input
          type="checkbox"
          checked={is2FAEnabled}
          onChange={handle2FAToggle}
        />
      </label>
    </div>
  );
};

export default Settings;

