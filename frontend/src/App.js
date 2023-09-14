// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import ChangeTextComponent from "./components/ChangeTextComponent";
import Home from "./pages/Home";
import About from "./pages/About";
import "./App.css"; // Import du fichier CSS

function App() {
  return (
    <Router>
      <div className="App">
	<h1>Exemple de changement de texte</h1>
      	<ChangeTextComponent />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

