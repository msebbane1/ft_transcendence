import React, { useEffect } from 'react';

const CallbackPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const clientId = '${CLIENT_ID}';
    const clientSecret = '${SECRET}';

    const API_42 = process.env.REACT_APP_API_42;
    const redirectUri = `${window.location.origin}/auth/callback`;

    fetch('${API_42}/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Stockez le jeton d'accès dans le localStorage
        localStorage.setItem('accessToken', data.access_token);
        // Redirigez l'utilisateur vers la page principale
        window.location.href = '/home';
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
