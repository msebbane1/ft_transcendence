// ChangeTextComponent.js

import React, { useState } from "react";

function ChangeTextComponent() {
  // Utilisez l'état (state) pour gérer le texte affiché dans le composant
  const [text, setText] = useState("Cliquez sur le bouton pour changer le texte");

  // Fonction pour changer le texte lorsque le bouton est cliqué
  const handleChangeText = () => {
    setText("Le texte a été modifié !");
  };

  return (
    <div>
      <p>{text}</p>
      <button onClick={handleChangeText}>Changer le texte</button>
    </div>
  );
}

export default ChangeTextComponent;

