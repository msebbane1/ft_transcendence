import axios from 'axios';

export const handleAuthentification = async (user, setLoading, navigate) => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const { protocol, hostname, port } = window.location;

  if (code && !user.has("access_token")) {
    setLoading(true);
    const tokenUrl = `${protocol}//${hostname}:8080/api/auth/callback/`;

    try {
      const response = await axios.post(
        tokenUrl,
        { code },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      const accessToken = response.data.access_token;
      user.setAll(data);
      console.log("token1:", accessToken);
    } catch (error) {
      console.error('Error while fetching access token:', error);
    }
  } else {
    console.error('No code parameter found in the URL.');
  }
};

