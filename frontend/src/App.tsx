import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import HomePage from './HomePage';
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Game from './pages/Game';
import "./App.css"; // Import du fichier CSS
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
	  <Route path='/auth' element={<LoginComponent />} />
          <Route path='/Login' element={<Login/>} />
          <Route path='/Chat' element={<Chat/>} />
	  <Route path='/Game' element={<Game/>} />
        </Routes>
	<HomePage />
      </div>
    </Router>
  );
}
export default App;
