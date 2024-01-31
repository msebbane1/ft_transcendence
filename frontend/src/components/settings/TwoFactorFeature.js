import styles from '../../styles/Settings.module.scss';
import QrCode from "./QrCode";
import QrCodeValidator from "./QrCodeValidator";
import useUser from '../../hooks/useUserStorage';
import { useState } from 'react';
import { SettingsFeature } from '../../pages/Settings2';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button } from 'react-bootstrap';

const TwoFactorFeature = () => {
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
    
      <Row className="bg-dark rounded p-4">
        
          <QrCode size="150px" />
       
        <Col md={6} className="text-center rounded-end">
          {error && <strong className={styles.settings_feature_error}>{error}</strong>}
          {!session.get("status_2FA") ? (
            <QrCodeValidator
              then={handleActivation}
              placeholder="Code secret"
            />
          ) : (
            <Button
              onClick={handleDesactivation}
              className={styles.settings_feature_desactivate}
            >
              Désactiver
            </Button>
          )}
        </Col>
      </Row>
  
  );
};

export default TwoFactorFeature;

