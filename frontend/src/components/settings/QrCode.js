import React from 'react';
import useUser from '../../hooks/useUserStorage';
import axios from "axios";
import { useState } from "react";
import { useEffect } from 'react';


// conversion en base64 pour le qrcode
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const QrCode = (props) => {
  const { size } = props;
  const user = useUser("user");
  const [QrCodeImage, setQrCodeImage] = useState("");

  useEffect(() => {
    const getQrCodeUser = async () => {
      try {

        const responsejwt = await axios.post(
          `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
        );
        const response = await fetch("https://localhost:8080/api/auth/qrcode/", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${responsejwt.data.jwt_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pseudo: user.get("pseudo"),
            secret: user.get("2FASecret")
          })
        });

        if (response.ok){
          const imageBuffer = await response.arrayBuffer();
          const base64Image = arrayBufferToBase64(imageBuffer);
        setQrCodeImage(`data:image/png;base64,${base64Image}`);
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };

    getQrCodeUser();
  }, [user]);

  return (
    <div style={{
      backgroundImage: `url(${QrCodeImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "12px",
      width: size || 150,
      height: size || 150,
      margin: "auto"
    }} />
  );
}

export default QrCode;

