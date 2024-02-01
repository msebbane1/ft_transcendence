import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import "./Settings.css"
/*MODALS*/
import TwoFA from '../modals/TwoFAModals';
import UsernameModals from '../modals/UsernameModals';

const Profil = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const user = useUser("user");

  const handleActivation = () => {
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
    <div className="container mask-custom mt-5 p-4 col-lg-6 rounded"> {/*changer en blanc ?*/}
        <div>
          {/* Section Titre Settings */}
              <div className="row mb-0"> {/*<div className="row mb-4 border-bottom border-dark">*/}
             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-settings"></div>
              <p class="title-profile-settings">PROFILE</p>
	     </div>
             </div>
            </div>
    	</div>
  );
};

export default Profil;
