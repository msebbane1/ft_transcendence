import React, { useState } from 'react';
import axios from 'axios';
import './Profil.css';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import ProfilePicture from '../components/ProfilePicture';
import "./Settings.css"
/*MODALS*/
import TwoFA from '../modals/TwoFAModals';
import EditUsernameModals from '../modals/EditUsernameModals';
import EditAvatarModals from '../modals/EditAvatarModals';


const Settings = () => {
  const user = useUser("user");
  const [error, setError] = useState('');
  const [username, setUsername] = useState(user.get("username"));
  const [profilePictureURL, setProfilePictureURL] = useState(user.get("Profilepic"));
  const [avatarUpdated, setAvatarUpdated] = useState(false); // Ajout de l'état local

  const handleAvatarUpdate = () => {
    setAvatarUpdated(true); // Met à jour l'état local pour indiquer un changement d'avatar
  };

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
              {/*<ProfilePicture/>*/}
              {profilePictureURL ? (
                <ProfilePicture avatarUpdate={avatarUpdated} /> // Passez l'état local à ProfilePicture
              ) : (
                <div className="default-avatar">
                  <div className="animate-ping position-absolute translate middle rounded-circle active-indicator"></div>
                </div>
              )}

            </div>
            <p className="profile-info-text">{username}</p>
            <p class="profile-info-text">{user.get("status_2FA") ? "2FA: On" : "2FA: Off"}</p>
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
            {/* Passez la fonction de mise à jour de l'avatar comme prop */}
            <EditUsernameModals setUsername={setUsername} />
            <EditAvatarModals setProfilePictureURL={setProfilePictureURL} updateAvatar={handleAvatarUpdate} />
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
            <TwoFA />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Settings;

