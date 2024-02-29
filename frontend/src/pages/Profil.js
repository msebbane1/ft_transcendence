import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import useUser from '../hooks/useUserStorage';
import { Link } from 'react-router-dom';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
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

  const [showModal, setShowModal] = useState(false);
  const [baliseTexte, setBaliseTexte] = useState('');
  const [popupInfo, setPopupInfo] = useState({message: '', variant:'success'});

  const   handleShowModal = () => setShowModal(true);
  const   handleCloseModal = () => setShowModal(false);

  const   handleInputChange = (event) => {
    setBaliseTexte(event.target.value);
  }

  
  

  const handleSubmitAdd = async () => {
        try {
            const response = await axios.post('https://127.0.0.1:8080/api/addFriend', 
            {
                user_to_add: baliseTexte,
                username: user.get('username')
            });
            
            if (response.data.message)
                setPopupInfo({message: response.data.message, variant: 'success'});
            else
                setPopupInfo({message: response.data.error, variant: 'danger'})
            console.log(response.data)
            handleCloseModal()
        } catch (error) {
            console.error('Erreur lors de la requete au backend: ', error);
            //setPopupInfo({message: 'Une erreur s\'est produite lors de la requête au backend.', variant: 'danger' });
        }
    };

    const handleSubmitDel = async () => {
        try {
            const response = await axios.post('https://127.0.0.1:8080/api/delFriend', 
            {
                user_to_del: baliseTexte,
                username: user.get('username')
            });
            
            if (response.data.message)
                setPopupInfo({message: response.data.message, variant: 'success'});
            else
                setPopupInfo({message: response.data.error, variant: 'danger'})
            console.log(response.data)
            handleCloseModal()
        } catch (error) {
            console.error('Erreur lors de la requete au backend: ', error);
            //setPopupInfo({message: 'Une erreur s\'est produite lors de la requête au backend.', variant: 'danger' });
        }
    };

  return (
  <>
  {popupInfo.message && (
      <div className="justify-content-md-center" class="popup">
          <Alert variant={popupInfo.variant} onClose={() => setPopupInfo({message: '', variant: 'success'})} dismissible>
              {popupInfo.message}
          </Alert>
      </div>
  )}
    <div className="container mask-custom mt-5 p-4 col-lg-6 rounded"> {/*changer en blanc bg-white ?*/}
        <div>
          {/* Section Titre Profile */}
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

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                        <Modal.Title>Ajouter/Supprimer un ami</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form.Group controlId="formBaliseTexte">
                            <Form.Label>Entrez le nom d'utilisateur :</Form.Label>
                            <Form.Control type="text" value={baliseTexte} onChange={handleInputChange} />
                        </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="primary" onClick={handleSubmitAdd}>
                            Ajouter
                        </Button>
                        <Button variant="primary" onClick={handleSubmitDel}>
                            Supprimer
                        </Button>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Fermer
                        </Button>
                        </Modal.Footer>
                    </Modal>


	                </div>
                  <p className="profile-info-text">@{user.get("username")}</p>
                  <p className="profile-info-text">{user.get("pseudo")}</p>
                  <p className="profile-info-text">status : {user.get("status")}</p>
                </div>
                
                </div>
                <div className="col text-center d-flex justify-content-center align-items-center">
                    <Button variant="light" size='sm' onClick={handleShowModal}>
                        Gestion d'ami
                    </Button>
                </div>
                <div className="col text-center d-flex justify-content-center align-items-center">
                <div className="icon-profile"/>
                    <p class="title-profile">Liste d'ami</p>
                </div>
                <div className="col text-center d-flex justify-content-center align-items-center">
                    {

                    }
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
    </>
  );
};

export default Profil;
