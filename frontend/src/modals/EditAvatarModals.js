import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import useUser from '../hooks/useUserStorage';

const EditAvatarModal = ({refreshProfilePicture}) => {
  const [showModal, setShowModal] = useState(false);
  const user = useUser("user");
  const [error, setError] = useState('');
  //const [profilePictureURL, setProfilePictureURL] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
          setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          handleCloseModal();
        }, 2000);
      }
      else {
        if (response.data['noimage'] === false)
          setError("No image provided");
        setTimeout(() => setError(null), 2000);
      }
    } catch (error) {
	    setError(error.response.data.error);
      console.error('Error updating avatar image:', error);
    }
  };

  return (
    <div>
      <Button className="Button-settings !important" onClick={handleOpenModal}>
        Edit Avatar
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
	      {error && <Alert variant="danger">{error}</Alert>}
          {showSuccessMessage && (
            <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
              The profile picture has been successfully updated!
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <input type="file" accept="image/jpeg, image/jpg, image/png, image/svg+xml" onChange={handleImageChange} />
            <button type="submit">Update Avatar</button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditAvatarModal;
