import React, { useState } from "react";
import useUser from "../../hooks/useUserStorage";
import axios from "axios";
import "../../pages/2FA.css";

const CheckValidQrCode = ({ checkStatusCode }) => {
  const user = useUser("user");
  const [error, setError] = useState(null);
  const [codes, setCodes] = useState(Array(6).fill(""));

  const { protocol, hostname } = window.location;

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      setCodes((prevCodes) => {
        const newCodes = [...prevCodes];
        newCodes[index] = value;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const secret = user.get("2FASecret");
    const code = codes.join("");

    try {
      const responsejwt = await axios.post(
        `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
      );
      const response = await axios.post(
        `${protocol}//${hostname}:8080/api/auth/2fa/`,
        {
          secret: secret,
          code: code,
        },
        {
          headers: {
            "Content-Type": "application/json",
	          'Authorization': `Bearer ${responsejwt.data.jwt_token}`,
          },
        }
      );

      const data = response.data;

      if (data.status) {
        checkStatusCode(true);
      } else {
        checkStatusCode(false);
      }
    } catch (error) {
      setError("Error");
      setTimeout(() => setError(null), 2000);
      checkStatusCode(false);
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
              placeholder="_"
              onChange={(e) => handleChange(index, e.target.value)}
              maxLength={1}
            />
          </div>
        ))}
      </div>
      <button className="button2FA" type="submit">
        Activate
      </button>
      {error && <strong className="text-danger">{error}</strong>}
    </form>
  );
};

export default CheckValidQrCode;
