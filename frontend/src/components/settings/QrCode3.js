import React from 'react';
import QrCodeReact from 'react-qr-code';
import useUser from '../../hooks/useUserStorage';

const QrCode = (props) => {
  const { size } = props;
  const user = useUser("user");

  const qrCodeValue = user.get("2FA_secret");
  const qrCodeSize = size || 150;

  return (
    <QrCodeReact
      value={qrCodeValue}
      size={qrCodeSize}
    />
  );
}

export default QrCode;
