import React, { useState } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import QrCode from '../components/settings/QrCode'; // Import your QrCode component
import QrCodeValidator from '../components/settings/QrCodeValidator'; // Import your QrCodeValidator component
import styles from '../styles/Settings.module.scss'; // Import your styles if you're using CSS modules
import axios from 'axios'; // Import axios if not already imported
import { SettingsFeature } from './Settings2';
import useUser from '../hooks/useUserStorage';
import 'bootstrap/dist/css/bootstrap.min.css';

const Two = () => {
  const session = useUser("user");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleActivation = async (status) => {
    console.log("2FA status (activate) =", session.get("status_2FA"));
    if (status) {
      console.log("status =", status);
      return session.set("status_2FA", true);
    }
    setError("Code invalide");
    setTimeout(() => setError(null), 2000);
  };

  const handleDesactivation = async (status) => {
    if (status) {
      console.log("2FA status (activate) apres =", session.get("status_2FA"));
      try {
        const response = await axios.post(
          `https://${window.location.hostname}:8080/api/auth/disable_2fa/`,
          {
            secret: session.get("2FA_secret"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.get("access_token")}`,
            },
          }
        );

        const data = response.data;

        if (data.status) {
          session.set("status_2FA", false);
        } else {
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      {/* Button to open the modal */}
      <Button className="custom-button" onClick={handleShowModal}>
        Activer
      </Button>

      {/* Modal for 2FA activation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Activer 2FA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* QR Code Section */}
          <Row className="bg-dark rounded p-4">
            <QrCode size="150px" />
            <Col md={6} className="text-center rounded-end">
              {/* QR Code Validator Section */}
              {error && <strong className={styles.settingsFeatureError}>{error}</strong>}
              {!session.get("status_2FA") ? (
                <QrCodeValidator
                  then={handleActivation}
                  placeholder="Code secret"
                />
              ) : (
                <Button
                  onClick={handleDesactivation}
                  className={styles.settingsFeatureDesactivate}
                >
                  Désactiver
                </Button>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => {
            handleActivation();
            handleCloseModal();
          }}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Two;

