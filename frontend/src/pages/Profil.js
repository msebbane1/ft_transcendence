import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import { useImageContext } from '../context/ImageContext';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';

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
    <div className="containerProfile profile-grid1">
      {error && <p>Erreur : {error}</p>}
      {profileData && (
        <>
          <div className="containerProfile profile-1">
	     <div className="profile-content1">
              <div className="profile-content">
                <div className="profile-info">
                  <div className="info-header">
                	<div className="icon-profile"></div>
                	<h1>
                  	USERNAME
                	</h1>
                	<div className="edit-button">
                  	<Link to="/settings">Edit</Link>
                   </div>
                  </div>
                  <p>{profileData.login}</p>
                </div>
              </div>
              <div className="profile-content">
                <div className="profile-info">
                  <h1> FULL NAME </h1>
                  <p>{profileData.usual_full_name}</p>
                </div>
              </div>
              <div className="profile-content">
                <div className="profile-info">
	         <div className="info-header">
                	<div className="icon-email"></div>
                	<h1>
                  	EMAIL
                	</h1>
                	<div className="edit-button">
                  	<Link to="/settings">Edit</Link>
                	</div> 
                  </div>
                  <p>{profileData.email}</p>
                </div>
              </div>
              <div className="profile-content">
                <div className="profile-info">
	          <div className="info-header">
                	<div className="icon-secure"></div>
                	<h1>
                  	Two Factor Auth
                	</h1>
                	<div className="edit-button">
                  	<Link to="/settings">Edit</Link>
                	</div>
                  </div>
                  <p> disabled </p>
                </div>
              </div>
	    </div>
          </div>	
          <div className="containerProfile profile-2">
	  {user.has("ProfileAvatar") && (
            <img
	      className="profile-image"
              src={user.get("ProfileAvatar")}
              alt="Image de profil"
             /* style={{
                maxWidth: '100%',
                height: 'auto',
	 	display: 'flex',
                marginTop: '10px',
	        marginRight: '60%',
	        justifyContent: 'center',
	        alignItems: 'center',
  		textAlign: 'center',
	        //borderRadius: '50%',
                //boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            }}*/
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profil;

