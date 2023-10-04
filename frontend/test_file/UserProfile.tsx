import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  // État pour stocker l'URL de la photo de profil
  const [profileImage, setProfileImage] = useState('');

  // Fonction pour récupérer les données de l'utilisateur depuis l'API 42
  const fetchUserProfile = async () => {
    try {
      // Remplacez 'accessToken' par le véritable jeton d'accès de l'utilisateur
      const accessToken = 'VOTRE_JETON_D_ACCES';

      // Faites une requête à l'API 42 pour récupérer les données de l'utilisateur
      const response = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Récupérez l'URL de la photo de profil depuis les données de l'utilisateur
        const userImageUrl = userData.image_url;
        // Stockez l'URL dans l'état
        setProfileImage(userImageUrl);
      } else {
        console.error('Erreur lors de la récupération des données de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
    }
  };

  useEffect(() => {
    // Appelez la fonction pour récupérer les données de l'utilisateur lors du chargement du composant
    fetchUserProfile();
  }, []);

  return (
    <div>
      <h1>Profil de l'utilisateur</h1>
      {/* Affichez la photo de profil de l'utilisateur */}
      <img src={profileImage} alt="Photo de profil" />
    </div>
  );
};

export default UserProfile;

