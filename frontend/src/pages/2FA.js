import { useState } from "react";
import useUser from "../hooks/useUserStorage";
import styles from "../styles/2FA_module.scss";
import settingsStyles from "../styles/Settings.module.scss";
import QrCodeValidator from "../components/settings/QrCodeValidator";
import { useNavigate } from "react-router-dom";

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

    // Définir le titre de la page
    document.title = "2-Factor Auth - Vérification du code...";

    return (
        <main>
            {loading ? (
                <div>

                </div>
            ) : (
                <div className={styles.authentification}>
                    <h1>2-Factor Auth</h1>
                    <p>Veuillez entrer votre code secret de 2FA.</p>
                    {error && <strong className={settingsStyles.settings_feature_error}>{error}</strong>}
                    <QrCodeValidator then={handleValidation} placeholder="Code secret" />
                </div>
            )}
        </main>
    );
}

export default TwoFactorAuth;
