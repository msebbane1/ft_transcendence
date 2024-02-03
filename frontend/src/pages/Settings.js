import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import "./Settings.css"
/*MODALS*/
import TwoFA from '../modals/TwoFAModals';
import EditUserModals from '../modals/EditUserModals';

const Settings = () => {
  const user = useUser("user");
  const [error, setError] = useState('');
  const [username, setUsername] = useState(user.get("username"));
	console.log("username(settings): ", user.get("username"));

  useEffect(() => {
    const accessToken = user.get("access_token");
    console.log("token :", accessToken);

    if (accessToken) {
      axios.post('https://localhost:8080/api/userinfos/', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log('data:', response.data);

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
              <p class="title-profile-settings">SETTINGS</p>
             </div>
            </div>

             {/* Section Photo et nom */}
             <div className="row mb-0">
	      <div className="col text-center position-relative">
	       {user.has("ProfileAvatar") && 
	       ( <div className="position-relative">
          <img
            className="rounded-circle larger-profile-pic"
            src={user.get("ProfileAvatar")}
            alt="Image de profil"
          />

          <div
            className="animate-ping position-absolute translate middle rounded-circle active-indicator"
            
          ></div>
        </div>
      )}
    		<p className="profile-info-text">{username}</p>
    		<p class="profile-info-text" >{user.get("status_2FA") ? "2FA: On" : "2FA: Off"}</p>
  	      </div>
	     </div>
              {/* Section Titre User */}
            
             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-profile"></div>
              <p class="title-profile">AVATAR/USERNAME</p>
             </div>
            

         {/* Section change Nom Utilisateur/Avatar */}
          <div className="row mb-2">
            <div className="col text-center">
	      <EditUserModals setUsername={setUsername}/>
            </div>
          </div>
          {/* Section Titre 2FA */}
            
             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-secure"></div>
              <p class="title-profile">TWO-FACTOR-AUTH</p>
             </div>
      
          {/* Section 2FA */}
          <div className="row mb-2">
            <div className="col text-center">
              <TwoFA/>
          </div>
	  </div>
	 </div>

      
    </div>
  );
};

export default Settings;
