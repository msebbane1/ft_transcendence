import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import ProfilePicture from '../components/ProfilePicture';
import "./Settings.css"
/*MODALS*/
import TwoFAModals from '../modals/TwoFAModals';
import EditUsernameModals from '../modals/EditUsernameModals';
import EditAvatarModals from '../modals/EditAvatarModals';
import EditPasswordModals from '../modals/EditPasswordModals';
import TwoFAEmailModals from '../modals/TwoFAEmailModals';


const Settings = () => {
  const user = useUser("user");
  const [error, setError] = useState('');
  const [username, setUsername] = useState(user.get("username"));
  const [profilePictureURL, setProfilePictureURL] = useState(user.get("Profilepic"));
  console.log("username(settings): ", user.get("avatar_update"));
  console.log("avatarurl(settings): ", user.get("Profilepic"));
  console.log("settings(image variable) ==== ", localStorage.getItem("image"));


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

             {/* Section Photo et nom + 2FA status*/}
             <div className="row mb-0">
              <div className="col text-center">
               <div className="position-relative">

			      <ProfilePicture/>
            			
                </div>
                <p className="profile-info-text">@{username}</p>
	{/*<p class="profile-info-text" >{user.get("status_2FA") ? "2FA: On" : "2FA: Off"}</p>*/}
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
            <div className="d-inline-block">
            <EditUsernameModals setUsername={setUsername}/>
            </div>
             <div className="d-inline-block mx-2">
             <EditAvatarModals setProfilePictureURL={setProfilePictureURL}/>
             </div>
            </div>
          </div>
		{/* Section Titre Changement Password */}

             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-key"></div>
              <p class="title-profile"> PASSWORD TOURNAMENT </p>
             </div>

          {/* Section password tournament */}
          <div className="row mb-2">
            <div className="col text-center">
              <EditPasswordModals/>
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
            <div className="d-inline-block">
            <TwoFAModals/>
            </div>
             <div className="d-inline-block mx-2">
             <TwoFAEmailModals/>
             </div>
            </div>
          </div>
         </div>


    </div>
  );
};

export default Settings;
