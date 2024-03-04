import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useUser from '../hooks/useUserStorage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutModals = ({ showModal, handleClose }) => {
    const user = useUser("user");
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState(null);

    const handleLogout = async () => {
        try {

            const response = await axios.post(`https://localhost:8080/api/auth/logout/${user.get("id")}/`);
            if (response) {
                user.clear();
                setTimeout(() => navigate("/"), 500);
  
            } else {
                setLogoutError(response.data.error);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            setLogoutError('Une erreur s\'est produite lors de la déconnexion.');
        }
    };

    /*
    const handleLogout = async () => {
                user.clear();
                setTimeout(() => navigate("/"), 500);
    };*/

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation de déconnexion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Êtes-vous sûr de vouloir vous déconnecter?</p>
                {logoutError && <p style={{ color: 'red' }}>{logoutError}</p>}
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

