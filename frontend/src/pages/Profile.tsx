import React, { useEffect, useState } from 'react';

function Profile() {
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const fetchProfileImage = async () => {
        try { 
          const response = await fetch('https://api.intra.42.fr/v2/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            const imageUrl = userData.image_url;
            setProfileImageUrl(imageUrl);
console.log(imageUrl);
          } else {
            console.error('Erreur lors de la récupération des données de l\'utilisateur :', response.status);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'image de profil :', error);
        }
      };

      fetchProfileImage();
    }
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <img src={profileImageUrl} alt="Photo de profil" />
    </div>
  );
}

export default Profile;

