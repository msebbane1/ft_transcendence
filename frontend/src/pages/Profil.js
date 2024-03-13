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
  const   handleShowModal = () => setShowModal(true);
  const   handleCloseModal = () => setShowModal(false);

  const   handleInputChange = (event) => {
    setBaliseTexte(event.target.value);
  }

  useEffect(() => {
    
      const response = axios.post('https://localhost:8080/api/getFriends', 
      {
        'id': user.get('id'),
      },).then((response) => {
          if (response.data.error)
            setlistFriend({"message": ""});
          else
            setlistFriend(response.data.message);
      }).catch((error) => {
          setError(error.message);
      });
      const res_stat = axios.post('https://localhost:8080/api/statsGames',
      {
        'id': user.get('id'),
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
        'id': user.get('id'),
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

          const responsejwt = await axios.post(
            `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
          );
          const response = await axios.post('https://localhost:8080/api/addFriend', 
          {
              user_to_add: baliseTexte,
              username: user.get('username')
          },
          {headers: {
            Authorization: `Bearer ${responsejwt.data.jwt_token}`,
            'Content-Type': 'application/json',
          },});
          
          if (response.data.message)
          {
            setPopupInfo({message: response.data.message, variant: 'success'});
            setTimeout(() => {window.location.reload();}, 2000);
          }
          else
            setPopupInfo({message: response.data.error, variant: 'danger'})
          setBaliseTexte('');
          handleCloseModal();
        } catch (error) {
            console.error('Backend request error: ', error);
            //setPopupInfo({message: 'Une erreur s\'est produite lors de la requête au backend.', variant: 'danger' });
        }
    };
    const handleSubmitDel = async () => {
        try {

          const responsejwt = await axios.post(
            `https://localhost:8080/api/auth/get-tokenjwt/${user.get("id")}/`, {},{}
          );
          const response = await axios.post('https://localhost:8080/api/delFriend', 
          {
              user_to_del: baliseTexte,
              username: user.get('username')
          },
          {headers: {
            Authorization: `Bearer ${responsejwt.data.jwt_token}`,
            'Content-Type': 'application/json',
          },});
          
          if (response.data.message)
          {
            setPopupInfo({message: response.data.message, variant: 'success'});
            setTimeout(() => {window.location.reload();}, 2000);
          }
          else
              setPopupInfo({message: response.data.error, variant: 'danger'})
          setBaliseTexte('');
          handleCloseModal();
        } catch (error) {
            console.error('Backend request error: ', error);
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
          {/* Section Titre Profile */}
              <div className="row mb-0"> {/*<div className="row mb-4 border-bottom border-dark">*/}
                <div className="col d-flex justify-content-center align-items-center">
                  <div className="icon-profile1"></div>
                  <p className="title-profile-settings">PROFILE</p>
	              </div>
              </div>
           
	  {/* Section Photo et nom */}
              <div className="row mb-0">
                <div className="col text-center position-relative">
		              <div className="position-relative">

		                <ProfilePicture />

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                        <Modal.Title>Add/remove friends</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form.Group controlId="formBaliseTexte">
                            <Form.Label>Enter username :</Form.Label>
                            <Form.Control type="text" value={baliseTexte} onChange={handleInputChange} />
                        </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="primary" onClick={handleSubmitAdd}>
                            Add
                        </Button>
                        <Button variant="primary" onClick={handleSubmitDel}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
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
                        Friends management
                    </Button>
                </div>
                <div className="col text-center d-flex justify-content-center align-items-center">
                <div className="icon-profile"/>
                    <p className="title-profile">Friends</p>
                </div>
                <div className="row mb-0">
                  <div className="col text-center">      
                    {listFriend && ( <div className="d-flex flex-wrap">
                    {listFriend.map((e, index) => (
                      e.friend && (
                        <div key={index} className="mr-2">
                        <p className='text-white' style={{marginRight: '10px'}}>
                        <a href={`/profilefriends/${e.id}`} className="friend-link">
                        @{e.friend} : {e.status}
                      </a>
                    </p>
                    </div>
                      )
                    ))}
                    </div>
                  )}
              </div>
              </div>
              {/* Section Stats */}

             <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-stats"></div>
              <p className="title-profile">Statistics</p>
             </div>
             <div className="col text-center d-flex justify-content-center align-items-center">

              {statsGames && (
                  <Table striped bordered hover size='sm'>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Victories</th>
                        <th>Defeats</th>
                        <th>Equalities</th>
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

              {/* Section match history */}

              <div className="col d-flex justify-content-center align-items-center">
              <div className="icon-leader"/>
              <p className="title-profile">Match History</p>
              </div>
              <div className="col d-flex justify-content-center align-items-center">
              {listGames && listGames.list_object.length > 0 ? (
              <div>
                {listGames.list_object
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((element, index) => (
                    <div className='container mask-custom' key={index}>
                      <div className='row'>
                        {element.tournament && element.tournament !== '' && (
                          <p className="title-profile">{element.tournament}</p>
                        )
                        }
                        <p className="title-profile">{element.loser2 ? element.type_game + " 3Players" : (element.type_game == 'PONG' ? element.type_game + " 2Players": element.type_game)}</p>
                        {element.winner && (
                          <p className="title-profile">Winner: {element.winner}</p>
                        )
                        }
                        {element.score && (
                          <p className="title-profile">{element.score}</p>
                        )
                        }
                        {element.loser && (
                          <p className="title-profile">Loser: {element.loser}</p>
                        )
                        }
                        {element.loser2 && (
                          <p className="title-profile">Loser: {element.loser2}</p>
                        )
                        }
                        {element.draw_user1 && element.draw_user2 && (
                          <p className="title-profile">Draw between {element.draw_user1} and {element.draw_user2}</p>
                        )
                        }
                        <p className="title-profile">{element.date}</p>
                      </div>
                    </div>
                  ))}
                  </div>
                ) : (
                  <div className="col text-center position-relative">
                  <p className="profile-info-text">You did not play any games yet</p>
                  </div>
                )}
                </div>
                </div>
                
                </>
                );
              };

export default Profil;