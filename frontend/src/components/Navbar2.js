import React, { useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import useUser from '../hooks/useUserStorage';

function NavBar() {
  const user = useUser("user");
  const imageProfile = user.get("ProfileAvatar");

  const fetchProfileImage = async () => {
    const accessToken = user.get("access_token");
    console.log("token NAV:", accessToken);

    if (accessToken && !imageProfile) {
      try {
        const response = await axios.post('https://localhost:8080/api/profileimage/', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const imageUrl = response.data.image_url;
        console.log('image url:', imageUrl);
        user.set("ProfileAvatar", imageUrl);
      } catch (error) {
        console.error('Erreur image', error);
      }
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, [user]);

  return (
    <div className="navbar">
     <div>
	  {imageProfile && <img src={imageProfile} alt="Image de profil" style={{
                maxWidth: '30%',
                height: 'auto',
                display: 'block',
                marginTop: '5px',
              }} />}
      </div>
	<div className="nav-links">
	<a href="/play">Game</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
	<a href="/logout">Logout</a>
        </div>
        <div className="text-containerl">
        <p className="text-pongl"> &gt; pong </p>
        <p className="text-gamel"> Game </p>
        </div>
    </div>
  );
}

export default NavBar;

