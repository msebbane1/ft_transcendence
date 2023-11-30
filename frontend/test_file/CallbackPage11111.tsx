import { useEffect } from 'react';
import axios from 'axios';

const CallbackPage1 = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        const response = await axios.post(
          'http://localhost:8080/login/42/callback/',
          {
            
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = response.data;
        const access_token = data.access_token;
        console.log('ACCESS TOKEN:', access_token);
        const jso = JSON.stringify({ access_token }); // Correction : tokenUrl -> access_token
        console.log('json = ', jso);
        localStorage.setItem('accessToken', access_token);

        const isAuthenticated = !!localStorage.getItem('accessToken');
        if (isAuthenticated) {

          .then(response => {
            const data = response.data;
            console.log('Protected data:', data);
            // Redirigez vers la page d'accueil ou effectuez d'autres actions nécessaires
            window.location.href = '/home';
          })
          .catch(error => {
            console.error('Error fetching protected data:', error);
          });
        }
      } catch (error) {
        console.error('Error exchanging code for access token:', error);
      }
    };

    // Appeler la fonction fetchData
    fetchData();
  }, []);

  return (
    <div>
      <p>Authentification en cours...</p>
    </div>
  );
};

export default CallbackPage1;

