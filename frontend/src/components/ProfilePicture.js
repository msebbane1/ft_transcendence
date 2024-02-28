import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserStorage from "../hooks/useUserStorage";
import "../pages/Settings.css";

const ProfilePicture = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useUserStorage('user');
  
  console.log("image_update :", user.get('avatar_update'));
  console.log("avatar_image localstorage", localStorage.getItem("image"));

  useEffect(() => {
    const fetchAvatarImage = async () => {
      try {
          let avatarUrl;
          console.log("into", localStorage.getItem("image")); 
          if (user.get("register") == null && localStorage.getItem("image") == "false") {  
            avatarUrl = `https://localhost:8080/api/avatar42/${user.get("avatar_id")}/`;
            console.log('if');
          }
          else if (localStorage.getItem("image") == "true")
          {
            avatarUrl = `https://localhost:8080/api/avatar/${user.get("avatar_id")}/`;
            console.log("elif");
          }
          else
          {
            console.log("else");
            return;
          }
        const response = await axios.get(avatarUrl);
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
  }, [localStorage.getItem("image")]);

  return (
    <div className="position-relative">
      <div className="profile-picture-container">
        
        {!loading && imageUrl ? (
          <img
            className="rounded-circle larger-profile-pic"
            src={imageUrl}
            alt="Image de profil"
          />
        ) : null}
      
        {!loading && !imageUrl && (
          <div className="default-avatar">
            <div className="animate-ping position-absolute translate middle rounded-circle active-indicator"></div>
          </div>
        )}
        
        {!loading && imageUrl && (
          <div className="animate-ping position-absolute translate middle rounded-circle active-indicator"></div>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;

