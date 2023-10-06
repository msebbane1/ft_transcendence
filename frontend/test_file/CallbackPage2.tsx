import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CallbackPage = () => {
 const navigate = useNavigate();
 useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const clientId = '$(CLIENT_ID)'; // Remplacez par votre véritable client ID
    const clientSecret = '$(SECRET)'; // Remplacez par votre véritable client secret
    const redirectUri = '$(API_42)'; // Remplacez par votre véritable URL de redirection

    // Encodez le client ID et le client secret en base64
    const base64Credentials = btoa(`${clientId}:${clientSecret}`);

    fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Credentials}`, // Incluez les identifiants dans l'en-tête
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Erreur lors de l\'échange de code :', response.status, response.statusText);
          return;
        }
        return response.json();
      })
      .then((data) => {
        // Stockez le jeton d'accès dans le localStorage
        localStorage.setItem('accessToken', data.access_token);
        // Redirigez l'utilisateur vers la page principale
        //window.location.href = '/home';
        navigate('/home');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'échange de code :', error);
      });
  }, []);

  return (
    <div>
      <p>Authentification en cours...</p>
    </div>
  );
};

export default CallbackPage;

