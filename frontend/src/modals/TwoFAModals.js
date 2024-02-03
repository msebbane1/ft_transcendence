import React, { useState } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import QrCode from '../components/settings/QrCode';
import QrCodeValidator from "../components/settings/Qr";
import useUser from '../hooks/useUserStorage';
import styles from '../styles/Settings.module.scss';
import '../pages/Settings.css';
import axios from 'axios';

const TwoFAModals = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
	const session = useUser("user");
  const [error, setError] = useState(null);
  const { protocol, hostname, port } = window.location;

  const handleActivation = async (status: boolean) => {
    console.log("2FA status (activate) =", session.get("status_2FA"));
    if (status) {
       console.log("status =", status);
      return session.set("status_2FA", true);
    }
    setError("Code invalide");
    setTimeout(() => setError(null), 2000);
  };

  const handleDesactivation = async (status: boolean) => {
    if (status) {
            console.log("2FA status (activate) apreees =", session.get("status_2FA"));
      try {
        const response = await axios.post(
          `https://${hostname}:8080/api/auth/disable_2fa/`,
          {
            secret: session.get("2FA_secret"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.get("access_token")}`, // A chnager avec token JWT
            },
          }
        );

        const data = response.data;

        if (data.status) {
          session.set("status_2FA", false);
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
    }
  };

  return (
    <div>
      {/* Button to open the modal */}
	  {!session.get("status_2FA") ? (
                 <Button className="Button-settings-2FA-ON" onClick={handleShowModal}>
                 Turn on 2FA
      		</Button>
              ) : (
                <Button className="Button-settings-2FA-OFF" onClick={handleDesactivation}>
                  Turn off 2FA
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
	  	    <p className="mb-4"><p>
                {session.get("status_2FA") ? "Two-factor authentication is enabled" : 
			"Saisissez le code à 6 chiffres généré par votre app Google Authentificator."}</p></p>
	  	    
              {/* QR Code Validator Section */}
              {error && <strong className={styles.settingsFeatureError}>{error}</strong>}
              {!session.get("status_2FA") ? (
                <QrCodeValidator
                  then={handleActivation}
                  placeholder="_"
                />
              ) : (
                <Button
                  onClick={handleDesactivation}
                  className={styles.settingsFeatureDesactivate}
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

