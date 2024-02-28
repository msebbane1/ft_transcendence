import React, { useState } from 'react';
import axios from 'axios';

const UpdateAvatarForm = ({ avatarId }) => {
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(`https://localhost:8080/api/avatarup/${avatarId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Image updated successfully', response.data);
      // Rafraîchir l'image d'avatar après la mise à jour
      // Vous pouvez appeler une fonction pour recharger l'image ici
    } catch (error) {
      console.error('Error updating avatar image:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button type="submit">Update Avatar</button>
    </form>
  );
};

export default UpdateAvatarForm;

