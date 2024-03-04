import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import useUser from '../hooks/useUserStorage';

const EditAvatarModal = ({refreshProfilePicture}) => {
  const [showModal, setShowModal] = useState(false);
  const user = useUser("user");
  const [error, setError] = useState('');
  //const [profilePictureURL, setProfilePictureURL] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', imageFile);

    try {

      const responsejwt = await axios.post(
        `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
      );
      
      const response = await axios.post(`https://localhost:8080/api/user/update-avatar/${user.get("avatar_id")}/`, formData, {
        headers: {
          Authorization: `Bearer ${responsejwt.data.jwt_token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

        if (response.data.image_url) {
          user.set('Profilepic', response.data.image_url);
          //setProfilePictureURL(response.data.image_url);
	  refreshProfilePicture()
          handleCloseModal();
          //window.location.reload();
      }
    } catch (error) {
	setError(error.response.data.error);
      console.error('Error updating avatar image:', error);
    }
    
  };

const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <Button className="Button-settings !important" onClick={handleOpenModal}>
        Edit Avatar
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
	 {error && <strong className="error-message">{error}</strong>}
          <form onSubmit={handleSubmit}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit">Update Avatar</button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditAvatarModal;
