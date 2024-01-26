import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import OTP from 'otplib';

const TwoFactorAuth = () => {
  const { register, handleSubmit } = useForm();
  const [verificationCode, setVerificationCode] = useState('');

  const generateVerificationCode = () => {
    const secret = OTP.authenticator.generateSecret();
    const code = OTP.authenticator.generate(secret);
    setVerificationCode(code);
  };

  const onSubmit = () => {
    // Envoyer le code de vérification au backend pour enregistrement et vérification ultérieure
    // ...

    // Redirection ou autre traitement après soumission réussie
  };

  return (
    <div>
      <h2>Authentification à Deux Facteurs (2FA)</h2>
      <button onClick={generateVerificationCode}>Générer le code de vérification</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Code de vérification :
          <input
            type="text"
            {...register('verificationCode', { required: true })}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </label>
        <button type="submit">Vérifier le code 2FA</button>
      </form>
    </div>
  );
};

export default TwoFactorAuth;

