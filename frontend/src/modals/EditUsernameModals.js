import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import useUser from '../hooks/useUserStorage';
import "../pages/Settings.css"

const EditUsernameModal = ({ setUsername }) => {
  const [showModal, setShowModal] = useState(false);
  const user = useUser("user");
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveUsername = async () => {

    try {

      const responsejwt = await axios.post(
        `https://localhost:8080/api/get-tokenjwt/${user.get("id")}/`, {},{}
      );

      const response = await axios.post(
        `https://localhost:8080/api/update-username/${user.get("id")}/`,
        { username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${responsejwt.data.jwt_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        user.set('username', newUsername);
        setUsername(newUsername);
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
      <Button className="Button-settings !important" onClick={handleOpenModal}>
        Edit Username
      </Button>

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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveUsername}>
            Enregistrer Nom d'Utilisateur
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditUsernameModal;

