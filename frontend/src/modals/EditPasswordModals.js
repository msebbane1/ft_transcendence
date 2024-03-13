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
  const handleCloseModal = () => {
    setShowModal(false);
    setNewPassword('');
    setConfirmPassword('');
  }
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

      if (response.data.message) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          handleCloseModal();
        }, 2000);
        setNewPassword('');
        setConfirmPassword('');
      }
      else{
        if (response.data['empty'] === false)
          setError("Please enter a password");
        if (response.data['lenmin'] === false)
          setError("Password must contain at least 5 characters");
        if (response.data['lenmax'] === false)
          setError("Password must contain a maximum of 10 characters");
        if (response.data['repeat'] === false)
          setError("The password doesn't match");
        setTimeout(() => setError(null), 2000);
        setNewPassword('');
        setConfirmPassword('');
    }
    } catch (error) {
      if (error.response) {
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
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {showSuccessMessage && (
            <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
             The password has been successfully updated!
            </Alert>
          )}
          <Form>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm  new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePassword}>
            Save password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditPasswordModal;

