import { useState } from "react";
import useUser from "../../hooks/useUserStorage";
import axios from "axios";
import styles from "../../styles/Settings.module.scss";

const QrCodeValidator = ({ then, placeholder }: {
  then: (status: boolean) => void,
  placeholder: string
}) => {
  const session = useUser("user");
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);
  const { protocol, hostname, port } = window.location;

  const handleChange = (e: any) => {
    let enteredCode = e.target.value || e.currentTarget.value;
    let lastChar = parseInt(enteredCode.slice(-1));
    if (enteredCode === "") {
      setCode("");
    }
    if (lastChar >= 0 && lastChar <= 9 && enteredCode.length <= 6) {
      setCode(enteredCode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${protocol}//${hostname}:8080/api/auth/2fa/`,
        {
          secret: session.get("2FA_secret"),
          code: code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log("data status:", data.status);
      console.log("data 2FA QRCodevalidator:", data);

      if (data.status) {
        then(true);
      } else {
        setError("Code invalide §");
        setTimeout(() => setError(null), 2000);
        then(false);
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la 2FA :", error);
      setError("Erreur inattendue");
      setTimeout(() => setError(null), 2000);
      then(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={styles.settings_feature_input_code}
        type="text"
        value={code || ""}
        placeholder={placeholder}
        onChange={handleChange}
      />
      <button type="submit">{"Activer"}</button>
      {error && <strong className={styles.settings_feature_error}>{error}</strong>}
    </form>
  );
};

export default QrCodeValidator;

