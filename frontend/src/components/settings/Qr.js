import React, { useState } from "react";
import useUser from "../../hooks/useUserStorage";
import axios from "axios";
import "../../pages/2FA.css";

const Qr = ({ then, placeholder }: {
  then: (status: boolean) => void,
  placeholder: string
}) => {
  const session = useUser("user");
  const [error, setError] = useState(null);
  const [codes, setCodes] = useState(Array(6).fill(""));

  const { protocol, hostname } = window.location;

  const handleChange = (index: number, value: string) => {
  if (/^\d*$/.test(value) && value.length <= 1) {
    setCodes((prevCodes) => {
      const newCodes = [...prevCodes];
      newCodes[index] = value;

      // Déplacer la saisie à la case suivante s'il y en a une
      if (index < newCodes.length - 1 && value.length === 1) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }

      return newCodes;
    });
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
	    const secret = session.get("2FA_secret");
    const code = codes.join("");
    console.log("Secret:", secret);
    console.log("Code:", code);
      const response = await axios.post(
        `${protocol}//${hostname}:8080/api/auth/2fa/`,
        {
          secret: secret,
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
        setError("Réesayer code invalide");
        setTimeout(() => setError(null), 2000);
        then(false);
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la 2FA :", error);
      setError("Erreur");
      setTimeout(() => setError(null), 2000);
      then(false);
    }
  };

return (
    <form onSubmit={handleSubmit} className="text-center">
      <div className="row mb-4">
        {codes.map((code, index) => (
  <div key={index} className="col-lg-2 col-md-2 col-2 mb-2">
    <input
      id={`input-${index}`}
      type="text"
      className="form-control text-center"
      value={code}
      placeholder={placeholder}
      onChange={(e) => handleChange(index, e.target.value)}
      maxLength={1}
    />
  </div>
))}
      </div>
      <button className="button2FA" type="submit">
        Activer
      </button>
      {error && <strong className="text-danger">{error}</strong>}
    </form>
  );
};


export default Qr;

