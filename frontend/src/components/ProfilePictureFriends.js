import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages/Settings.css";

const ProfilePicture = ({ userId, avatarId, userStatus }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvatarImage = async () => {
      try {
        if (userId && avatarId) {
          const response = await axios.get(`https://localhost:8080/api/user/avatar/${userId}/${avatarId}`);
          setImageUrl(response.data.image_url);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching avatar image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarImage();
  }, [userId, avatarId]);

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
          <div className={`default-avatar`}>
            <div className={`animate-ping position-absolute translate middle rounded-circle active-indicator ${userStatus === 'offline' ? 'offline' : ''}`}></div>
          </div>
        )}
        
        {!loading && imageUrl && (
          <div className={`animate-ping position-absolute translate middle rounded-circle active-indicator ${userStatus === 'offline' ? 'offline' : ''}`}></div>

        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
