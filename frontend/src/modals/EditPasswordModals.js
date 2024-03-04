import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import useUser from '../hooks/useUserStorage';
import "../pages/Settings.css";

const EditPasswordModal = () => {
  const [showModal, setShowModal] = useState(false);
  const user = useUser("user");
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSavePassword = async () => {
    try {

      const responsejwt = await axios.post(
        `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
      );

      const response = await axios.post(
        `https://localhost:8080/api/user/update-password/${user.get("id")}/`,
        { new_password: newPassword, repeatPassword: confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${responsejwt.data.jwt_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          handleCloseModal();
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
        setTimeout(() => setError(null), 2000);
      }
    }
  };

  return (
    <div>
      <Button className="Button-settings !important" onClick={handleOpenModal}>
        Create/Change password
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {showSuccessMessage && (
            <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
              Le mot de passe a été mis à jour avec succès !
            </Alert>
          )}
          <Form>
            <Form.Group controlId="formNewPassword">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez le nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmez le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSavePassword}>
            Enregistrer le mot de passe
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditPasswordModal;

