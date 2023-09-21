import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './HomePage';
import Navbar from './pages/Navbar';
import Chat from './pages/Chat';
import Game from './pages/Game';
import "./App.css"; // Import du fichier CSS
import './styles.css';

function Interface() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/Login' element={<Login/>} />
          <Route path='/Chat' element={<Chat/>} />
	  <Route path='/Game' element={<Game/>} />
        </Routes>
	<HomePage />
      </div>
    </Router>
  );
}
export default Interface;
