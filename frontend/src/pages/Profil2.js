import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import { useImageContext } from '../context/ImageContext';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profil = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const user = useUser("user");

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
    <div className="container mt-5">
      {error && <p className="text-danger">Erreur : {error}</p>}
      {profileData && (
        <>
          <div className="text-center mb-4">
            <h1>Settings</h1>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="icon-profile mr-3"></div>
                    <h1 className="mb-0">Nom Utilisateur</h1>
                  </div>
                  <div className="edit-button mt-3">
                    <Link to="/settings">Edit</Link>
                  </div>
                  <p className="profile-info-text">Username 42: {profileData.login}</p>
                  <p className="profile-info-text">Full name: {profileData.usual_full_name}</p>
                  <p className="profile-info-text">Pseudo: </p>
                  <button className="btn btn-primary">Click me</button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="icon-secure mr-3"></div>
                    <h1 className="mb-0">Two Factor Auth</h1>
                  </div>
                  <div className="edit-button mt-3">
                    <Link to="/settings">Edit</Link>
                  </div>
                  <p className="profile-info-text">2FA: {user.get("status_2FA") ? "Activer" : "Desactiver"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            {user.has("ProfileAvatar") && (
              <img className="profile-image rounded-circle" src={user.get("ProfileAvatar")} alt="Image de profil" />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profil;

