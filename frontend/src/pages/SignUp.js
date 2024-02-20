import React, { useState } from 'react';
import { Button, Form, Alert} from 'react-bootstrap';
import "./signup.css";
import LoginAuthorize from '../components/LoginAuthorize';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUserStorage';

const SignUpPage = () => {
  const user = useUser("user");
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:8080/api/signup/', { 
        username,
	password,
	repeatPassword,

      });
    	
	const data = response.data;
      	console.log('Server response:', response.data);
	user.setAll(data);
	   
	setShowSuccessMessage(true);
      	setUsername('');
      	setPassword('');
      	setRepeatPassword('');

	    setTimeout(() => {
        navigate("/");
      }, 3000);
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
    <div className="container " style={{ maxWidth: '600px' }}>
      <br />
      <hr />

      <div className="card bg-light">
        <article className="card-body mx-auto" style={{ maxWidth: "400px" }}>
          <h4 className="card-title mt-3 text-center">Sign Up</h4>
          <p className="text-center">Connect with 42 login or create an account</p>
         
          <p className="divider-text">
            <span className="bg-light">OR</span>
          </p>

	  {showSuccessMessage && ( 
            <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
              You have successfully signed up!
            </Alert>
          )}
		
	   {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
      	    <label class="control-label"  for="username">Username</label>
            <div className="form-group input-group mb-3">
              <input 
                className="form-control" 
                placeholder="Username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
	  <label class="control-label" for="password">Password</label>
            <div className="form-group input-group mb-3">
              <input 
                className="form-control" 
                placeholder="Create password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
		 <label class="control-label"  for="password_confirm">Password (Confirm)</label>
            <div className="form-group input-group mb-3">
              <input 
                className="form-control" 
                placeholder="Repeat password" 
                type="password" 
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <Button type="submit" className="btn btn-primary btn-block"> Sign Up </Button>
            </div>
          </form>
        </article>
      </div>
    </div>
  );
};

export default SignUpPage;

