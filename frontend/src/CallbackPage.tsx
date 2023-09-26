import React, { useEffect } from 'react';

const CallbackPage = () => {
  useEffect(() => {
    // Extraitz le code d'autorisation de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Échangez le code contre un jeton d'accès A MODIFIER EN ENV
    const clientId = 'u-s4t2ud-0eb1371b71fe5c6a555fd5eb1d7e9e369041aae68a8f326cd93b1f6b8b167b54';
    const clientSecret = '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';
    const redirectUri = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0eb1371b71fe5c6a555fd5eb1d7e9e369041aae68a8f326cd93b1f6b8b167b54&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code';

    fetch('https://api.intra.42.fr/oauth/token', {
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
        // Stockez le jeton d'accès
        const accessToken = data.access_token;

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

