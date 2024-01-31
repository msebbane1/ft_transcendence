
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useUser from '../hooks/useUserStorage';

const AvatarModals = ({ handleActivation }) => {
  const [showModal, setShowModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const user = useUser("user");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    console.log('Nouvelle photo de profil :', file);
    user.set("ProfileAvatar", file);
  };

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      <div className="edit-button" onClick={handleShowModal}>
        Change Avatar
      </div>

      {/* Modal pour l'activation 2FA */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Changer Username</Modal.Title>
        </Modal.Header>
       	<div>
                <div>
                <label>
                Changer la photo de profil:
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                </label>
              </div>
        </div>
      </Modal>
    </>
  );
};

export default AvatarModals;

