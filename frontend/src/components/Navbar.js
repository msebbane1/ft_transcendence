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
   	<div class="text-containerl">
           <p><span class="text-pongl">pong</span><span class="text-gamel">Game</span>
           </p>
          </div>
	<a href="/home">Home</a>
	<a href="/play">Game</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
    	<a href="/logout" className="logout-link"></a>
	  <div className="pic-nav">
          {imageProfile && <img src={imageProfile} alt="Image de profil" class="pic-nav" />}
      </div>
  </div>
  );
}

export default NavBar;

