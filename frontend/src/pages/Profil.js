import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import { useImageContext } from '../ImageContext';

const Profil = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  //const [profileImage, setProfileImage] = useState(null);
  const { profileImage, setProfileImageURL } = useImageContext();

  useEffect(() => {
    // Récupére le token depuis le stockage local
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      // Requete API info
      axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
	  console.log('data:', response.data);
          setProfileData(response.data);
	  //console.log('imagedata:', response.data.image);
	  const imageUrl = response.data.image.link;

          if (imageUrl) {
            console.log('image url:', imageUrl);
            //setProfileImage(imageUrl);
	    setProfileImageURL(imageUrl);
	    localStorage.setItem('ProfileAvatar', imageUrl);
          } else {
            setError('Aucune image de profil');
          }
        // A MODIFIER si je veux recuperer l'image du coté backend
	/*
          axios.get('http://localhost:8080/profileimage/', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((imageResponse) => {
	      console.log('token:', accessToken);
	      console.log('Image response:', imageResponse);
	      console.log('Image data:', response.data.image_url);
              //setProfileImage(imageResponse.data.image);
            })
            .catch((imageError) => {
	      console.log('Image error:', imageError);
              setError(imageError.message);
            });
	*/
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, []);

  return (
    <div>
      {error && <p>Erreur : {error}</p>}
      {profileData && (
        <div className="containerProfile">
          <h1>Profil de {profileData.login}</h1>
          <p>Nom: {profileData.first_name}</p>
          <p>Prénom: {profileData.last_name}</p>
          <p>Image utilisateur : </p>
	  {profileImage && (
            <img
              src={profileImage}
              alt="Image de profil"
              style={{
                maxWidth: '20%',
                height: 'auto',
	 	display: 'block',
                marginTop: '10px', 
              }}
		/>
          )}
        </div>
      )}
    </div>
  );
};

export default Profil;

