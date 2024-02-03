import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const LogoutModals = ({ showModal, handleClose }) => {
  const user = useUser("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    user.clear();
    setTimeout(() => navigate("/"), 500);
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation de déconnexion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Êtes-vous sûr de vouloir vous déconnecter?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleLogout}>
          Se déconnecter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModals;

