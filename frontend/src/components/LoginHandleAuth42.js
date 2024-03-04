import axios from 'axios';

export const handleAuthentification42 = async (user, setLoading) => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const { protocol, hostname} = window.location;

  //&& !user.has("access_token")
  if (code) {
    setLoading(true);
    try {
      const response = await axios.post(`${protocol}//${hostname}:8080/api/auth/login42/`,
        { code },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      //const accessToken = response.data.access_token;

      user.setAll(data);
      //console.log("token1:", accessToken);
    } catch (error) {
      console.error('Error while fetching access token:', error);
    }
  } else {
    console.error('No code parameter found in the URL.');
  }
};

