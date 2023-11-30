import { useEffect } from 'react';

const CallbackPage8 = () => {
  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log('Code received:', code);

      if (code) {
        const tokenUrl = 'http://localhost:8080/login/42/callback/';

        try {
          const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          const access_token = data.access_token;
          console.log('ACCESS TOKEN:', access_token);
          localStorage.setItem('accessToken', access_token);

          // ... le reste de votre logique
        } catch (error) {
          console.error('Error exchanging code for access token:', error);
        }
      } else {
        console.error('No code parameter found in the URL.');
      }
    };

    fetchData();
  }, []);


 return (
    <div>
      <p>Authentification en cours...</p>
    </div>
  );
};

export default CallbackPage8;
