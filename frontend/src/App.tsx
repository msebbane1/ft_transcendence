import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Interface from './Interface';
import "./App.css";
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
	<Route path="/" element={<Login />} />
        <Route path="/home" element={<Interface />} />
      </Routes>
    </Router>
  );
}
export default App;
