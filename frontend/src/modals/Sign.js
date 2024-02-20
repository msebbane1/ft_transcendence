import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import useUser from '../hooks/useUserStorage';
import { useNavigate } from 'react-router-dom';

const SignInModals = () => {
  const user = useUser("user");
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:8080/api/signin/', {
        username,
        password,
      });

      const data = response.data;
      console.log('Server response:', response.data);

      user.setAll(data);

      setUsername('');
      setPassword('');
	 setTimeout(() => navigate("/home"), 500);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        // Afficher le message d'erreur renvoyé par le serveur dans la console
        console.log('Server error:', error.response.data.error);
        setError(error.response.data.error);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <button className="signin-button" onClick={handleShow}>Sign In</button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="text-center">
          <Modal.Title className="w-100">Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">Please enter your login and password!</p>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <label className="control-label" htmlFor="username">Username/Email</label>
            <Form.Group className="form-group mb-3">
              <Form.Control
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Mettre à jour l'état username
              />
            </Form.Group>
            <label className="control-label" htmlFor="password">Password</label>
            <Form.Group className="form-group mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Mettre à jour l'état password
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign In
            </Button>
            <p> Don't have an account?</p>
            <span className="pull-right"> <a href="signup">Sign Up</a></span>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignInModals;

