import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import useUser from '../hooks/useUserStorage';
import axios from 'axios';

const EditUserModals = ({ setUsername }) => {
  const [showModal, setShowModal] = useState(false);
  const user = useUser("user");
  const [profilePicture, setProfilePicture] = useState('');
  const [newUsername, setNewUsername] = useState('');


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

	//A MODIFIER
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    console.log('Nouvelle photo de profil :', file);
    user.set("ProfileAvatar", file);
  };

  const handleSaveUsername = async () => {
    try {
      
      const response = await axios.post(
        'https://localhost:8080/api/userinfos/',
        { username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${user.get("jwt_token")}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
	user.set('username', newUsername);
       // setCurrentUsername(newUsername);
	setUsername(newUsername);
	console.log("username(modal) after: ", user.get("username"));
	setNewUsername('');
        handleCloseModal();
        
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la requête POST :', error);
    }
  };

  return (
    <div>
      {/* Bouton pour ouvrir le modal */}
      <Button className="Button-settings" onClick={handleOpenModal}>
        Edit Username/Avatar
      </Button>
	
     {/* Changer nom User */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le nom d'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewUsername">
              <Form.Label>Nouveau nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nouveau nom d'utilisateur"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
	{/* Changer Avatar */}
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
          <Button variant="primary" onClick={handleSaveUsername}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditUserModals;

