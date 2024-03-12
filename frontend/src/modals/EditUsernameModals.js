import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import useUser from '../hooks/useUserStorage';
import "../pages/Settings.css"

const EditUsernameModal = ({ setUsername }) => {
  const [showModal, setShowModal] = useState(false);
  const user = useUser("user");
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveUsername = async () => {

    try {

      const responsejwt = await axios.post(
        `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
      );

      const response = await axios.post(
        `https://localhost:8080/api/user/update-username/${user.get("id")}/`,
        { username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${responsejwt.data.jwt_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.message) {
        user.set('username', newUsername);
        setUsername(newUsername);
        //refreshUsername();
        setNewUsername('');
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          handleCloseModal();
        }, 2000);
      }
      else {
        if (response.data['empty'] === false)
          setError("Please enter a username");
        if (response.data['lenmin'] === false)
          setError("Username must contain at least 5 characters");
        if (response.data['lenmax'] === false)
          setError("Username must contain a maximum of 10 characters");
        if (response.data['alpha'] === false)
          setError("Username must contain letters only");
        if (response.data['nameAlreadyUse'] === false)
          setError("Username already in use, choose another one...");
      setTimeout(() => setError(null), 2000);
    }
    } catch (error) {
      if (error.response) {
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
          <Modal.Title>Change username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {showSuccessMessage && (
            <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
              Username has been successfully updated !
            </Alert>
          )}
          <Form>
            <Form.Group controlId="formNewUsername">
              <Form.Label>New username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveUsername}>
            Save username
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditUsernameModal;

