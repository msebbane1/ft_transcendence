import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import useUser from '../hooks/useUserStorage';
import axios from 'axios';
import "../pages/Settings.css" 

const EditUserModals = ({ setUsername }) => {
  const [showModal, setShowModal] = useState(false);
  const user = useUser("user");
  const [profilePicture, setProfilePicture] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

	//A MODIFIER
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    axios.post(`https://localhost:8080/api/update-profile-picture/${user.get("id")}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${user.get("jwt_token")}`,
      }
    }).then(response => {
      console.log(response.data);
      user.set("ProfileAvatar", file);
    }).catch(error => {
      console.error('Erreur lors de la mise à jour de l\'image de profil :', error);
    });
  };

  const handleSaveUsername = async () => {
    try {
      console.log('Nouveau nom d\'utilisateur à enregistrer :', newUsername);
      const response = await axios.post(
        `https://localhost:8080/api/update-username/${user.get("id")}/`,
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
	console.log("username(modal) ", user.get("username"));
	console.log("newusername:", newUsername);
	setNewUsername('');
        handleCloseModal();
        
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
      		setError(error.response.data.error);
	      setTimeout(() => setError(null), 2000);
     }
    }
  };
    const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveUsername();
    }
  };

  return (
    <div>
      {/* Bouton pour ouvrir le modal */}
      <Button className="Button-settings !important" onClick={handleOpenModal}>
        Edit Username/Avatar
      </Button>
	
     {/* Changer nom User */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le nom d'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
	  {error && <strong className="error-message">{error}</strong>}
          <Form>
            <Form.Group controlId="formNewUsername">
              <Form.Label>Nouveau nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nouveau nom d'utilisateur"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
	  	onKeyDown={handleKeyDown}
              />
            </Form.Group>
          </Form>
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
	  </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditUserModals;

