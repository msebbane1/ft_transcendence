import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
//PAGES
import Login42 from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import TwoFA from './pages/2FA';
import Settings from './pages/Settings';
import Profil from './pages/Profil';
import Avatar from './pages/Avatarpage';

import Navbar from './components/Navbar';
import CallbackPage from './components/LoginAuthorize';

import PongGame from './pages/pongGame';
import PongGame3p from './pages/pongGame3p';
import PongGameIa from './pages/pongGameIa';
import Login2p from './pages/loginpong2p';
import Login3p from './pages/loginpong3p';
import ModePong from './pages/modePong';
//Tournament
import Tournament from './pages/tournament';
import TournamentPong from './pages/tournamentPong';
//import useUser from './hooks/useUserStorage';
// ROUTES
import NoRoute from './routes/NoRoute';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
/*import './global.css';*/
import 'bootstrap/dist/css/bootstrap.min.css';
import TicTacToeGame from './pages/TicTacToe'; //jeu Cassandra Player vs Player
import AITicTacToe from './pages/AI_TicTacToe'; // Player vs AI
import ModeTicTacToe from './pages/modeTicTacToe'; //choix du mode de jeu
//import TwoFAuthRoute from './routes/TwoFAuthRoute';


function App() {
const backgroundStyle = {
    background: 'url("./fond2.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    overflow: 'hidden',
  };
  return (
    <BrowserRouter>
      <div className="container-fluid" style={backgroundStyle}>
      <Routes>
    <Route path="/" element={<PublicRoute><div><Login42 /></div></PublicRoute>} />
    <Route path="/signup" element={<div><SignUp /></div>} />
    <Route path="/2fa" element={<PublicRoute><div><TwoFA /></div></PublicRoute>} />
    <Route path="/home" element={<PrivateRoute><div><Navbar /><Home /></div></PrivateRoute>} />
    <Route path="/play" element={<PrivateRoute><div><Navbar /><PongGame /></div></PrivateRoute>} />
    <Route path="/settings" element={<PrivateRoute><div><Navbar /><Settings /></div></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><div><Navbar /><Profil /></div></PrivateRoute>} />
    <Route path="/avatar" element={<PrivateRoute><div><Navbar /><Avatar /></div></PrivateRoute>} />
	  <Route path="*" element={<NoRoute />} />
  	<Route path="/modetictactoe" element={<PrivateRoute><div><Navbar /><ModeTicTacToe /></div></PrivateRoute>} />
  	<Route path="/ai-tictactoe" element={<PrivateRoute><div><Navbar /><AITicTacToe /></div></PrivateRoute>} />
  	<Route path="/tictactoe" element={<PrivateRoute><div><Navbar /><TicTacToeGame /></div></PrivateRoute>} />
    <Route path="/tournament" element={<PrivateRoute><div><Navbar /><Tournament/></div></PrivateRoute>} />
    <Route path="/tournamentPong" element={<PrivateRoute><div><Navbar /><TournamentPong/></div></PrivateRoute>} />
    <Route path="/modepong" element={<PrivateRoute><div><Navbar /><ModePong/></div></PrivateRoute>} />
    <Route path="/ia-pong" element={<PrivateRoute><div><Navbar /><PongGameIa/></div></PrivateRoute>} />
    <Route path="/pong3p" element={<PrivateRoute><div><Navbar /><PongGame3p/></div></PrivateRoute>} />
    <Route path="/login2p" element={<PrivateRoute><div><Navbar /><Login2p/></div></PrivateRoute>} />
    <Route path="/login3p" element={<PrivateRoute><div><Navbar /><Login3p/></div></PrivateRoute>} />
    <Route path="/pong" element={<PrivateRoute><div><Navbar /><PongGame/></div></PrivateRoute>} />
      </Routes>
	</div>
    </BrowserRouter>
  );
}

export default App;

