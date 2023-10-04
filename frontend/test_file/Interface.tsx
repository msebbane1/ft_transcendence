import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './pages/Navbar';
import Game from './pages/Game';
import "./App.css"; // Import du fichier CSS
import './styles.css';

function Interface() {
  return (
      <div className="App">
        <Navbar />
        <Routes>
	  <Route path='/Game' element={<Game/>} />
        </Routes>
      </div>
  );
}
export default Interface;
