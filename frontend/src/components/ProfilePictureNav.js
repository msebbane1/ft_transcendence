import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserStorage from "../hooks/useUserStorage";
import "../pages/Settings.css";

const ProfilePictureNav = ({ refreshImage }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useUserStorage('user');
  
  console.log("id :", user.get('id'));
  console.log("avatar_image localstorage", localStorage.getItem("image"));

  useEffect(() => {
    const fetchAvatarImage = async () => {
      try {
        const response = await axios.get(`https://localhost:8080/api/avatar/${user.get("id")}/${user.get("avatar_id")}/`);
        setImageUrl(response.data.image_url);
        user.set('Profilepic', response.data.image_url);
        console.log('pic userhook:', user.get('Profilepic'));
        console.log('url image', response.data.image_url);

      } catch (error) {
        console.error('Error fetching avatar image:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarImage();
  }, [imageUrl, refreshImage]);

  return (
    <div className="position-relative">
      <div className="profile-picture-container">
        
        {!loading && imageUrl ? (
          <img
            className="rounded-circle pic-nav"
            src={imageUrl}
            alt="Image de profil"
          />
        ) : null}
      
        {!loading && !imageUrl && (
		
          <div className="default-avatar-nav">
	  <div className="status-indicator"></div>
	  </div>
        )}
        
        {!loading && imageUrl && (
          <div className="status-indicator"></div>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureNav;

