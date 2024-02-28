import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvatarPage = () => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchAvatarImage = async () => {
      try {
        // Faites une requête à votre API Django pour obtenir l'URL de l'image de l'avatar
        const response = await axios.get('https://localhost:8080/api/avatar42/1/');
        setImageUrl(response.data.image_url);
        console.log("url image", response.data.image_url);
      } catch (error) {
        console.error('Error fetching avatar image:', error);
      }
    };

    fetchAvatarImage();
  }, []);

  return (
    <div>
      {imageUrl && <img src={imageUrl} alt="Avatar" />}
      {!imageUrl && <p>No avatar found.</p>}
    </div>
  );
};

export default AvatarPage;

