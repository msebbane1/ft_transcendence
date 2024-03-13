import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Profil.css';
import { Modal, Button, Alert, Table } from 'react-bootstrap';
import ProfilePictureFriends from '../components/ProfilePictureFriends';

const ProfileFriends = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [statsGames, setStatsGames] = useState('');
  const [listGames, setListGames] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post('https://localhost:8080/api/getUserInfos', {
          'id': id, 
        });
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setUserData(response.data.message);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchStatsAndGames = async () => {
      try {
        const responseStats = await axios.post('https://localhost:8080/api/statsGames', {
          'id': id,
        });
        if (responseStats.data.error) {
          setStatsGames({'message': ""});
        } else {
          setStatsGames(responseStats.data);
        }

        const responseListGames = await axios.post('https://localhost:8080/api/listGames', {
          'id': id,
        });
        if (responseListGames.data.error) {
          setListGames({'message': ''});
        } else {
          setListGames(responseListGames.data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
    fetchStatsAndGames();
  }, []);

  return (
    <div className="container mask-custom mt-5 p-4 col-lg-6 rounded">
      <div className="row mb-0">
        <div className="col d-flex justify-content-center align-items-center">
          <div className="icon-profile1"></div>
          <p className="title-profile-settings">FRIENDS</p>
        </div>
      </div>

      <div className="row mb-0">
        <div className="col text-center">
          <div className="position-relative">
          <ProfilePictureFriends
            userId={userData && userData.id}
            avatarId={userData && userData.avatar_id}
            userStatus={userData && userData.status}
          />
          </div>
            {userData && (
              <>
                <p className="profile-info-text">Pseudo: @{userData.username}</p>
                <p className="profile-info-text">Name: {userData.pseudo}</p>
                <p className="profile-info-text">Status: {userData.status}</p>
              </>
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
                  .slice(0, 3)
                  .map((element, index) => (
                    <div className='container mask-custom' key={index}>
                      <div className='row' >
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
                );
              };

export default ProfileFriends;

