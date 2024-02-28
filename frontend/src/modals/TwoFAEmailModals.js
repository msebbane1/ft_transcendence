import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const EmailVerificationModal = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setEmail('');
    setError('');
    setShowSuccessMessage(false);
    setShowModal(false);
  };

  const handleSendVerificationCode = async () => {
    try {
      await axios.post('https://localhost:8080/api/auth/2fa-email/', { email });
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Une erreur s\'est produite : ', error);
      setError('Une erreur s\'est produite lors de l\'envoi du code de vérification.');
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <Button className="Button-settings-2FA-ON" onClick={handleShowModal}>
        Turn on 2FA Email code
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Vérification par e-mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {showSuccessMessage && (
            <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
              Le code de vérification a été envoyé avec succès !
            </Alert>
          )}
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Adresse e-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSendVerificationCode}>
            Envoyer le code de vérification
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmailVerificationModal;

