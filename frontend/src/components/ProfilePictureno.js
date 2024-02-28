import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserStorage from '../hooks/useUserStorage';

const ProfilePicture = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [avatarUpdate, setAvatarUpdate] = useState(false); // Etat local pour avatar_update
  const user = useUserStorage('user');

  console.log("image_update :", user.get('avatar_update'));

  useEffect(() => {
    const fetchAvatarImage = async () => {
      try {
        let avatarUrl;

        if (!user.get("register") && avatarUpdate) { // Utilise avatarUpdate ici
          avatarUrl = `https://localhost:8080/api/avatar42/${user.get("avatar_id")}/`;
        } else {
          avatarUrl = `https://localhost:8080/api/avatar/${user.get("avatar_id")}/`;
        }

        const response = await axios.get(avatarUrl);
        setImageUrl(response.data.image_url);
        user.set('Profilepic', response.data.image_url);
        console.log('pic userhook:', user.get('Profilepic'));
        console.log('url image', response.data.image_url);
      } catch (error) {
        console.error('Error fetching avatar image:', error);
        //setImageUrl('url_de_votre_image_par_defaut.jpg');
      }
    };

    fetchAvatarImage();
  }, [user.get('avatar_update'), avatarUpdate]); // Utilise avatarUpdate comme dépendance

  return (
    <div className="position-relative">
      <div className="profile-picture-container">
        <div className="position-relative">
          <img
            className="rounded-circle larger-profile-pic"
            src={imageUrl}
            alt="Image de profil"
          />
          <div className="animate-ping position-absolute translate middle rounded-circle active-indicator"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;

