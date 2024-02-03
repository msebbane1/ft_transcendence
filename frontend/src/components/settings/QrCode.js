import React from 'react';
import QrCodeReact from 'react-qr-code';
import useUser from '../../hooks/useUserStorage';
import { useState } from "react";
import { useEffect } from 'react';

const QrCode = (props) => {
  const { size } = props;
  const user = useUser("user");
  const [qrCodeValue, setQrCodeValue] = useState("");

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch("https://localhost:8080/api/auth/qrcode/", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${user.get("access_token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: user.get("username"),
            secret: user.get("2FA_secret")
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch QR code');
        }

        const imageBuffer = await response.arrayBuffer();
        const base64Image = arrayBufferToBase64(imageBuffer);
        setQrCodeValue(`data:image/png;base64,${base64Image}`);
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };

    fetchQrCode();
  }, [user]);

  const qrCodeSize = size || 150;

  return (
    <div style={{
      width: qrCodeSize,
      height: qrCodeSize,
      backgroundImage: `url(${qrCodeValue})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "12px",
      margin: "auto"
    }} />
  );
}

// conversion array buffer to base64
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default QrCode;

