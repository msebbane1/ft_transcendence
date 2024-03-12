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
  const { protocol, hostname, port } = window.location;

  const handleActivation = async (checkstatus) => {
    console.log("2FA status (activate) =", user.get("status_2FA"));
    if (checkstatus) {
      console.log("checkstatys=", checkstatus);
      return user.set("status_2FA", true);
    }
    setError("Code invalide");
    setTimeout(() => setError(null), 2000);
  };

  const handleDesactivation = async () => {
      try {

        const responsejwt = await axios.post(
          `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
        );

        const response = await axios.post(
          `https://${hostname}:8080/api/auth/disable_2fa/`,
          {
            secret: user.get("2FA_secret"),
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
          user.set("status_2FA", false);
        }
        else {
          setError("Erreur inattendue");
          setTimeout(() => setError(null), 2000);
        }
      } catch (error) {
        console.error("Erreur lors de la désactivation de la 2FA :", error);
        setError("Erreur inattendue");
        setTimeout(() => setError(null), 2000);
      }
  };

  return (
    <div>
      {/* Button to open the modal */}
	  {!user.get("status_2FA") ? (
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
                {user.get("status_2FA") ? "Two-factor authentication is enabled" : 
			"Saisissez le code à 6 chiffres généré par votre app Google Authentificator."}</p>
	  	    
              {/* CheckValidQrCode Section */}
              {error && <div className="text-danger">{error}</div>}
              {!user.get("status_2FA") ? (
                <CheckValidQrCode
                  checkstatus={handleActivation}
                  placeholder="_"
                />
              ) : (
                <Button
                  onClick={handleDesactivation}
                  className="Button-settings-2FA-OFF"
                >
                  Désactiver
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

