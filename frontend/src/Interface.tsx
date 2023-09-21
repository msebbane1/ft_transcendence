import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './pages/Navbar';
import Chat from './pages/Chat';
import Game from './pages/Game';
import "./App.css"; // Import du fichier CSS
import './styles.css';

function Interface() {
  return (
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/Chat' element={<Chat/>} />
	  <Route path='/Game' element={<Game/>} />
        </Routes>
      </div>
  );
}
export default Interface;
