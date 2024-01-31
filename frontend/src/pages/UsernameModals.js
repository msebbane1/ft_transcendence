// TwoFA.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Settings.css';
import useUser from '../hooks/useUserStorage';

const UsernameModals = ({ handleActivation }) => {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const user = useUser("user");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    console.log('Nouvelle photo de profil :', file);
    user.set("ProfileAvatar", file);
  };

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      <Button className="Button-settings" onClick={handleShowModal}>
        Edit Username/Avatar
      </Button>

      {/* Modal pour changer Username */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Changer Username</Modal.Title>
        </Modal.Header>
       	<div>
                <label>
                Changer le nom d'utilisateur:
                <input type="text" value={userName} onChange={handleUserNameChange} />
                </label>
        </div>
	  <div>
                <div>
                <label>
                Changer la photo de profil:
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                </label>
              </div>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => {
            handleActivation();
            handleCloseModal();
          }}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsernameModals;

