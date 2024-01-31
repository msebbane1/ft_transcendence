import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import { useImageContext } from '../context/ImageContext';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';
import TwoFAComponent from '../components/settings/TwoFactorFeature';
import { Modal, Button } from 'react-bootstrap';
import "./Settings.css"
/*MODALS*/
import TwoFA from './TwoFAModals';
import UsernameModals from './UsernameModals';
import AvatarModals from './AvatarModals';

const Profil = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const user = useUser("user");

  const handleActivation = () => {
    // Logique pour activer la double authentification
    // ...
  };

  useEffect(() => {
    // Récupére le token depuis le stockage local
    //const accessToken = localStorage.getItem('accessToken');
    const accessToken = user.get("access_token");
    console.log("token :", accessToken);

    if (accessToken) {
      // Requete API info
      axios.post('https://localhost:8080/api/userinfos/', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          //console.log('Image URL:', response.data.image_url);
          console.log('data:', response.data);
          setProfileData(response.data);

          const imageUrl = response.data.image.link;

          if (imageUrl) {
            console.log('image url:', imageUrl);
            user.set("ProfileAvatar", imageUrl);
          } else {
            setError('Aucune image de profil');
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, []);

return (
    <div className="container bg-white mt-3 p-4 col-lg-6 rounded">
      {error && <p>Erreur : {error}</p>}
      {profileData && (
        <div>
          {/* Section Titre Settings */}

            <div className="row mb-4 border-bottom border-dark">
             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-settings"></div>
              <p class="title-profile">SETTINGS</p>
             </div>
            </div>

             {/* Section Photo et nom */}
             <div className="row mb-4">
  <div className="col text-center position-relative">
    {user.has("ProfileAvatar") && (
      <div className="position-relative">
        <img
          className="rounded-circle larger-profile-pic"
          src={user.get("ProfileAvatar")}
          alt="Image de profil"
	    
        />
	  <div className="active-indicator"></div>
	    </div>
    )}
    		<p className="profile-info-text">{profileData.login}</p>
    			{user.get("status_2FA") ? "2FA: On" : "2FA: Off"}
  		</div>
	     </div>
              {/* Section Titre User */}
            
             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-profile"></div>
              <p class="title-profile">AVATAR/USERNAME</p>
             </div>
            

         {/* Section change Nom Utilisateur/Avatar */}
          <div className="row mb-4">
            <div className="col text-center">
	      <UsernameModals/>
            </div>
          </div>
          {/* Section Titre 2FA */}
            
             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-secure"></div>
              <p class="title-profile">TWO-FACTOR-AUTH</p>
             </div>
      
          {/* Section 2FA */}
          <div className="row mb-4">
            <div className="col text-center">
              <TwoFA handleActivation={handleActivation} />
          </div>
	  </div>
	 </div>

      )}
    </div>
  );
};

export default Profil;
