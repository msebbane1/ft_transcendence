import { useState } from "react";
import useUser from "../hooks/useUserStorage";
import styles from "../styles/2FA_module.scss";
import settingsStyles from "../styles/Settings.module.scss";
import QrCodeValidator from "../components/settings/Qr";
import { useNavigate } from "react-router-dom";
import './2FA.css';
import './loading.css'

const TwoFactorAuth = () => {
    const session = useUser("user");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleError = (error) => {
        setError(error);
        setTimeout(() => setError(null), 2000);
    }

    const handleValidation = (status) => {
        if (status) {
            setLoading(true);
            session.set("2FA_valid", true);
            setTimeout(() => navigate("/home"), 1000);
        } else {
            handleError("Code invalide");
        }
    }

    return (
         <div className="container2FA">
	    <div className="authContainer">
            {loading ? (
                <div class="loading-2FA">
      		<p class="loading-2FA-text" >Authentification en cours...</p>
    		</div>
            ) : (
                <div>
                    <h1>Two-Factor autentification</h1>
                    <p>Saisissez le code à 6 chiffres généré par votre application pour confirmer votre action.</p>
                    <QrCodeValidator then={handleValidation} placeholder="_" />
                </div>
            )}
        </div>
     </div>
    );
}

export default TwoFactorAuth;
