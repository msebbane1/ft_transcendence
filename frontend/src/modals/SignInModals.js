import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import useUser from '../hooks/useUserStorage';
import { useNavigate } from 'react-router-dom'
import "../pages/Settings.css"
import './modals.css';
import LoginAuthorizeUrl from '../components/LoginAuthorizeUrl';

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
      const response = await axios.post('https://localhost:8080/api/auth/signin/', {
        username,
        password,
      }, {
        method: "POST",
            headers: {
                  'Content-Type': 'application/json',
            },
        });

      if (response.data.statusIn === true) {
        const data = response.data;

        user.setAll(data);
        setUsername('');
        setPassword('');
	      setTimeout(() => navigate("/home"), 500);
      }
      else {
        if (response.data['Namedontexist'] === false)
          setError("User doesn't exist");
        if (response.data['alphaName'] === false)
          setError("Username must contain letters only");
        if (response.data['nopassword'] === false)
          setError("Unauthorized connection, Please connect via 42");
        if (response.data['checkpassword'] === false)
          setError("Invalid password");

      setTimeout(() => setError(null), 2000);
    }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <button className="signin-button" onClick={handleShow}>Login</button>


      <Modal show={showModal} onHide={handleClose} className="custom-modal rounded">
        <Modal.Header className="p-4 text-center">
          <Modal.Title className=" w-100 fw-bold mb-2 text-uppercase" style={{ fontSize: '30px' }}>LOGIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">Please enter your login and password!</p>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit}>
		
	  <label>Username</label>
            <Form.Group className= "mb-4">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
	 
            </Form.Group>
	  
            <label className="control-label" htmlFor="password">Password</label>
            <Form.Group className= "mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>


	  <button className="sign-button mb-4" type="submit">SIGN IN</button>
	   <p className="mb-0">Don't have an account? <a href="signup" className="text-white-50 fw-bold">Sign Up</a>
	  </p>
		<p className="divider-text">
		<span className="bg-dark mask-custom" style={{ padding: '0px' }} >OR</span>
	         </p>
	  {/*//  <hr class="my-4"></hr>*/}
	  
	  
	</Form>
            <LoginAuthorizeUrl />

         
        </Modal.Body>
        
      </Modal>

    </>
  );
};

export default SignInModals;

