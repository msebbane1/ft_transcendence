import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePicture = ({ profilePictureURL }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
	  console.log("Updated profilePictureURL:", profilePictureURL);
    if (profilePictureURL) {
      setImageUrl(profilePictureURL);
    }
  }, [profilePictureURL]);

  return (
    <div className="position-relative">
      <img
        className="rounded-circle larger-profile-pic"
        src={imageUrl}
        alt="Image de profil"
      />
      <div
        className="animate-ping position-absolute translate middle rounded-circle active-indicator"></div>
    </div>
  );
};

export default ProfilePicture;

