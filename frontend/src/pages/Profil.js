import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import ProfilePicture from '../components/ProfilePicture';
import "./Settings.css"
/*MODALS*/
import TwoFA from '../modals/TwoFAModals';

const Profil = () => {
  const user = useUser("user");
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState(user.get("Profilepic"));
  const [imageUrl, setImageUrl] = useState('');

return (
    <div className="container mask-custom mt-5 p-4 col-lg-6 rounded"> {/*changer en blanc bg-white ?*/}
        <div>
          {/* Section Titre Settings */}
              <div className="row mb-0"> {/*<div className="row mb-4 border-bottom border-dark">*/}
             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-profile1"></div>
              <p class="title-profile-settings">PROFILE</p>
	     </div>
             </div>
           
	{/* Section Photo et nom */}
             <div className="row mb-0">
              <div className="col text-center position-relative">
		<div className="position-relative">

		<ProfilePicture/>

	{/* 
		{profilePictureURL ? (
                <ProfilePicture />
              ) : (
                <div className="default-avatar">
                  <div className="animate-ping position-absolute translate middle rounded-circle active-indicator"></div>
                </div>
              )}*/}
	 </div>
                <p className="profile-info-text">{user.get("username")}</p>
              </div>
             </div>
              {/* Section Stats */}

             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-stats"></div>
              <p class="title-profile">Statistics</p>
             </div>

          {/* Section Titre 2FA */}

             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-leader"></div>
              <p class="title-profile">Match History</p>
             </div>
         </div>
    </div>
  );
};

export default Profil;
