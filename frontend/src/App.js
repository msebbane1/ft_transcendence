import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';
import useUser from './hooks/useUserStorage';
//PAGES
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import TwoFA from './pages/2FA';
import Settings from './pages/Settings';
import Profil from './pages/Profil';
import ProfilFriends from './pages/ProfilFriends';
//Component
import Navbar from './components/Navbar';
//PongGame
import PongGame from './pages/pongGame';
import PongGame3p from './pages/pongGame3p';
import PongGameIa from './pages/pongGameIa';
import Login2p from './pages/loginpong2p';
import Login3p from './pages/loginpong3p';
import ModePong from './pages/modePong';
//Tournament PongGame
import Tournament from './pages/tournament';
import TournamentPong from './pages/tournamentPong';
//Tic Tac Toe
import TicTacToeGame from './pages/TicTacToe'; //jeu Cassandra Player vs Player
import AITicTacToe from './pages/AI_TicTacToe'; // Player vs AI
import ModeTicTacToe from './pages/modeTicTacToe'; //choix du mode de jeu
import Matchmaking from './pages/matchmakingTicTacToe';//Matchmaking
// ROUTES
import GameRoute from './routes/GameRoute';
import UnknowRoute from './routes/UnknowRoute';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/ProtectedRoute';


function App() {
  const user = useUser("user");
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
	<Route path="/" element={<PublicRoute><div><Login /></div></PublicRoute>} />
	<Route path="/signup" element={<PublicRoute><div><SignUp /></div></PublicRoute>} />
	<Route path="/2fa" element={<PublicRoute><div><TwoFA /></div></PublicRoute>} />
    <Route path="/home" element={<PrivateRoute><div><Navbar /><Home /></div></PrivateRoute>} />
	<Route path="/settings" element={<PrivateRoute><div><Navbar /><Settings /></div></PrivateRoute>} />
	<Route path="/profile" element={<PrivateRoute><div><Navbar /><Profil /></div></PrivateRoute>} />
  <Route path="/profilefriends/:id" element={<PrivateRoute><div><Navbar /><ProfilFriends /></div></PrivateRoute>} />
  	<Route path="/modetictactoe" element={<PrivateRoute><div><Navbar /><ModeTicTacToe /></div></PrivateRoute>} />
  	<Route path="/ai-tictactoe" element={<PrivateRoute><div><Navbar /><AITicTacToe /></div></PrivateRoute>} />
  	<Route path="/tictactoe" element={<PrivateRoute><div><Navbar /><TicTacToeGame /></div></PrivateRoute>} />
	<Route path="/matchmaking" element={<PrivateRoute><div><Navbar /><Matchmaking /></div></PrivateRoute>} />
	<Route path="/tournament" element={<PrivateRoute><div><Navbar /><Tournament/></div></PrivateRoute>} />
    <Route path="/modepong" element={<PrivateRoute><div><Navbar /><ModePong/></div></PrivateRoute>} />
    <Route path="/ia-pong" element={<PrivateRoute><div><Navbar /><PongGameIa/></div></PrivateRoute>} />
	<Route path="/login2p" element={<PrivateRoute><div><Navbar /><Login2p/></div></PrivateRoute>} />
	<Route path="/login3p" element={<PrivateRoute><div><Navbar /><Login3p/></div></PrivateRoute>} />
  <Route path="/pong3p" element={<GameRoute><div><Navbar /><PongGame3p/></div></GameRoute>} />
  <Route path="/tournamentPong" element={<GameRoute><div><Navbar /><TournamentPong/></div></GameRoute>} />
  <Route path="/pong" element={<GameRoute><div><Navbar /><PongGame/></div></GameRoute>} />
	<Route path="*" element={<UnknowRoute />} />
      </Routes>
	</div>
    </BrowserRouter>
  );
}

export default App;

