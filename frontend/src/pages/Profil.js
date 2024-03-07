import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profil.css';
import useUser from '../hooks/useUserStorage';
import { Modal, Button, Alert, Form, Table } from 'react-bootstrap';
import ProfilePicture from '../components/ProfilePicture';
import "./Settings.css"


const Profil = () => {
  const user = useUser("user");
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [baliseTexte, setBaliseTexte] = useState('');
  const [popupInfo, setPopupInfo] = useState({message: '', variant:'success'});
  const [listFriend, setlistFriend] = useState('');
  const [statsGames, setStatsGames] = useState('');
  const [listGames, setListGames] = useState('');
 

  console.log("username(profil): ", user.get("username"));


  const   handleShowModal = () => setShowModal(true);
  const   handleCloseModal = () => setShowModal(false);

  const   handleInputChange = (event) => {
    setBaliseTexte(event.target.value);
  }

  useEffect(() => {
      const response = axios.post('https://localhost:8080/api/getFriends', 
      {
        'username': user.get('username'),
      }, 
      {}).then((response) => {
          if (response.data.error)
            setlistFriend({"message": ""});
          else
            setlistFriend(response.data);
      }).catch((error) => {
          setError(error.message);
      });
      const res_stat = axios.post('https://localhost:8080/api/statsGames',
      {
        'username': user.get('username'),
      },
      {}).then((res_stat) => {
        if (res_stat.data.error)
          setStatsGames({'message': ""});
        else
          setStatsGames(res_stat.data);
      }).catch((error) => {
        setError(error.message);
      });
      const res_match_histo = axios.post('https://localhost:8080/api/listGames',
      {
        'username': user.get('username'),
      },
      {}).then((res_match_histo) => {
          if (res_match_histo.data.error)
            setListGames({'message': ''});
          else
            setListGames(res_match_histo.data);
      }).catch((error) => {
        setError(error.message);
      });
  }, []);
  

  const handleSubmitAdd = async () => {
        try {
            const response = await axios.post('https://localhost:8080/api/addFriend', 
            {
                user_to_add: baliseTexte,
                username: user.get('username')
            });
            
            if (response.data.message)
            {
              setlistFriend({"message": listFriend.message + ',' + baliseTexte});
              setPopupInfo({message: response.data.message, variant: 'success'});
            }
            else
                setPopupInfo({message: response.data.error, variant: 'danger'})
            setBaliseTexte('');
            handleCloseModal();
        } catch (error) {
            console.error('Erreur lors de la requete au backend: ', error);
            //setPopupInfo({message: 'Une erreur s\'est produite lors de la requête au backend.', variant: 'danger' });
        }
    };
    const handleSubmitDel = async () => {
        try {
            const response = await axios.post('https://localhost:8080/api/delFriend', 
            {
                user_to_del: baliseTexte,
                username: user.get('username')
            });
            
            if (response.data.message)
            {
              setlistFriend({"message": listFriend.message.replace(baliseTexte, '')});
              setPopupInfo({message: response.data.message, variant: 'success'});
            }
            else
                setPopupInfo({message: response.data.error, variant: 'danger'})
            setBaliseTexte('');
            handleCloseModal();
          } catch (error) {
            console.error('Erreur lors de la requete au backend: ', error);
            //setPopupInfo({message: 'Une erreur s\'est produite lors de la requête au backend.', variant: 'danger' });
        }
    };

  return (
  <>
  {popupInfo.message && (
      <div className="col d-flex justify-content-center align-items-center">
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

		                <ProfilePicture />

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
                      listFriend && (
                        <div>
                          {listFriend.message.split(',').map((element, index) => (
                            element.trim() !== '' && (
                              <p key={index} class='text-white'>{element}</p>
                            )
                          ))}
                        </div>
                      )
                    }
                </div>


              {/* Section Stats */}

             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-stats"></div>
              <p class="title-profile">Statistics</p>
             </div>
             <div className="col text-center d-flex justify-content-center align-items-center">

              {statsGames && (
                  <Table striped bordered hover size='sm'>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Victoires</th>
                        <th>Défaites</th>
                        <th>Egalites</th>
                        <th>Total</th>
                        <th>Winrate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>PONG</td>
                        <td>{statsGames.pong_win}</td>
                        <td>{statsGames.pong_lose}</td>
                        <td>/</td>
                        <td>{statsGames.pong_win + statsGames.pong_lose}</td>
                        <td>{statsGames.pong_wr}%</td>
                      </tr>
                      <tr>
                        <td>TICTACTOES</td>
                        <td>{statsGames.ttt_win}</td>
                        <td>{statsGames.ttt_lose}</td>
                        <td>{statsGames.draw_ttt}</td>
                        <td>{statsGames.ttt_win + statsGames.ttt_lose + statsGames.draw_ttt}</td>
                        <td>{statsGames.ttt_wr}%</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>{statsGames.total_win}</td>
                        <td>{statsGames.total_lose}</td>
                        <td>{statsGames.draw_ttt}</td>
                        <td>{statsGames.total_win + statsGames.total_lose + statsGames.draw_ttt}</td>
                        <td>{statsGames.tot_wr}%</td>
                      </tr>
                    </tbody>
                  </Table>
                )
              }

              </div>

              {/* Section Titre 2FA */}

              <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-leader"/>
              <p class="title-profile">Match History</p>
              </div>
              <div className="col d-flex justify-content-center align-items-center">
              {
              listGames && (
              <div>
                {
                  listGames.list_object.map((element, index) => (
                    <div className='container mask-custom'>
                      <div className='row' keys={index}>
                        {element.tournament && element.tournament !== '' && (
                          <p class="title-profile">{element.tournament}</p>
                        )
                        }
                        <p class="title-profile">{element.loser2 ? element.type_game + " 3Players" : (element.type_game == 'PONG' ? element.type_game + " 2Players": element.type_game)}</p>
                        {element.winner && (
                          <p class="title-profile">Winner: {element.winner}</p>
                        )
                        }
                        {element.score && (
                          <p class="title-profile">{element.score}</p>
                        )
                        }
                        {element.loser && (
                          <p class="title-profile">Loser: {element.loser}</p>
                        )
                        }
                        {element.loser2 && (
                          <p class="title-profile">Loser: {element.loser2}</p>
                        )
                        }
                        {element.draw_user1 && element.draw_user2 && (
                          <p class="title-profile">Draw between {element.draw_user1} and {element.draw_user2}</p>
                        )
                        }
                        <p class="title-profile">{element.date}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
              )
              }
            </div>
      </div>
    </div>
    </>
  );
};

export default Profil;