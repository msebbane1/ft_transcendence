import { useState } from "react";
import useUser from "../hooks/useUserStorage";
import CheckValidQrCode from "../components/settings/CheckValidQrCode";
import { useNavigate } from "react-router-dom";
import './2FA.css';
import './loading.css'

const TwoFactorAuth = () => {
    const user = useUser("user");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleValidation = (checkstatus) => {
        if (checkstatus) {
            setLoading(true);
            user.set("2FA_valid", true);
            setTimeout(() => navigate("/home"), 1000);
        } else {
            setError("Code invalide");
            setTimeout(() => setError(null), 2000);
        }
    }

    return (
         <div className="container2FA">
	    <div className="authContainer">
            {loading ? (
                <div className="loading-2FA">
      		<p className="loading-2FA-text" >Authentification en cours...</p>
    		</div>
            ) : (
                <div>
                    <h1>Two-Factor autentification</h1>
                    <p>Saisissez le code à 6 chiffres généré par votre application pour confirmer votre action.</p>
                    <CheckValidQrCode checkstatus={handleValidation} placeholder="_" />
                    {error && <div className="text-danger">{error}</div>}
                </div>
            )}
        </div>
     </div>
    );
}

export default TwoFactorAuth;
