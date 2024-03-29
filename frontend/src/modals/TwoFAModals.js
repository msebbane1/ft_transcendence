import React, { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import QrCode from '../components/settings/QrCode';
import CheckValidQrCode from "../components/settings/CheckValidQrCode";
import useUser from '../hooks/useUserStorage';
import '../pages/Settings.css';
import axios from 'axios';

const TwoFAModals = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const user = useUser("user");
  const [error, setError] = useState(null);
  const { hostname } = window.location;

  const handleActivation = async (checkStatusCode) => {
    if (checkStatusCode === true) {
      return user.set("status2FA", true);
    }
    else{
    setError("Invalid Code, try again.");
    setTimeout(() => setError(null), 2000);
    }
  };

  const handleDesactivation = async () => {
      try {

        const responsejwt = await axios.post(
          `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
        );

        const response = await axios.post(
          `https://${hostname}:8080/api/auth/disable_2fa/`,
          {
            secret: user.get("2FASecret"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${responsejwt.data.jwt_token}`,
            },
          }
        );

        const data = response.data;

        if (data.status) {
          user.set("status2FA", false);
        }
        else {
          setError("Unexpected error");
          setTimeout(() => setError(null), 2000);
        }
      } catch (error) {
        console.error("Error when disabling 2FA :", error);
        setError("Unexpected error");
        setTimeout(() => setError(null), 2000);
      }
  };

  return (
    <div>
      {/* Button to open the modal */}
	  {!user.get("status2FA") ? (
                 <Button className="Button-settings-2FA-ON" onClick={handleShowModal}>
                 Turn on 2FA App
      		</Button>
              ) : (
                <Button className="Button-settings-2FA-OFF" onClick={handleDesactivation}>
                  Turn off 2FA App
                </Button>
              )}
      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Two-Factor Auth Setup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
            
            <div className="row">
                <div className="card">
                  <div className="card-body px-lg-5 py-lg-5 text-center">
                    <QrCode size="200px" />
                    <h2 className="text-info">2FA Security</h2>
	  	    <p className="mb-4">
                {user.get("status2FA") ? "Two-factor authentication is enabled" : 
			"Enter the 6-digit code generated by your Google Authentificator app."}</p>
	  	    
              {/* CheckValidQrCode Section */}
              {error && <div className="text-danger">{error}</div>}
              {!user.get("status2FA") ? (
                <CheckValidQrCode checkStatusCode={handleActivation}/>
              ) : (
                <Button
                  onClick={handleDesactivation}
                  className="Button-settings-2FA-OFF"
                >
                  Disable
                </Button>
              )} 
                  </div>
            
              </div>
            </div>
         
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TwoFAModals;

