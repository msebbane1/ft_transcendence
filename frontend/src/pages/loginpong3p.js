import React, { useState, useEffect } from 'react';
import useUser from "../hooks/useUserStorage";
import axios from 'axios';
import { Link } from 'react-router-dom';
import './tournament.css';

var   playerN = 2;
var   settingOver = false;
var   userArray = [];

userArray.push(['alias1', "- ", "user"]);
userArray.push(['alias2', "- 1234", "none"]);
userArray.push(['alias3', "- 4321", "none"]);

const Login3p = () => {
  
  const user = useUser("user");
  const p1 = user.get("username");
  userArray[0][1] = p1;
  localStorage.setItem('alias1', p1+ "@+User");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState('');

  const areValuesUnique = (value1, value2, value3, value4) => {
    return value1 !== value2 && value1 !== value3 && value1 !== value4 &&
           value2 !== value3 && value2 !== value4 &&
           value3 !== value4;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Yo");
    const toadd = 'alias' + playerN;
    var  tocheck = username;
    if(loginMethod == 'Alias')
    {
      axios.post('https://localhost:8080/api/checkalias/', {
        username,
      })
      .then(response => {
        const data = response.data;
        user.set("pongAccess", 'pongv3');
        console.log("access dans choix = ", user.get("pongAccess"));

        setUsername('');
        setPassword('');
        setLoginMethod('');
        if(username && areValuesUnique(userArray[0][1], userArray[1][1], userArray[2][1], data.username)) {
          localStorage.setItem(toadd, data.username+"@+User");
          userArray[playerN-1][1] = data.username;
          playerN += 1;
          console.log(userArray);
        } else {
          alert("Alias/Username already in use.");
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
            alert(error.response.data.error); 
        } else {
            alert("An error occurred while processing your request.");
        }});
  }
  else if (loginMethod === 'User')
  {
    axios.post('https://localhost:8080/api/signintournament/', {
      username,
      password,
    })
    .then(response => {
      const data = response.data;
      user.set("pongAccess", 'pongtournament');
      console.log("access dans choix = ", user.get("pongAccess"));
      setUsername('');
      setPassword('');
      setLoginMethod('');
      
      if(username && areValuesUnique(userArray[0][1], userArray[1][1], userArray[2][1], data.username)) {
        localStorage.setItem(toadd, data.username+"@+User");
        userArray[playerN-1][1] = data.username;
        playerN += 1;
        console.log(userArray);
      } else {
        console.log("Adakor");
        alert("User/Alias doesn't exist or already in use.");
      }
    })
    .catch(error => {
      if (error.response && error.response.data) {
          alert(error.response.data.error); 
      } else {
          alert("An error occurred while processing your request.");
      }});
    };
  }
  return (
    <div className="container">
      {playerN < 4 && (<h2 style={{color:'white'}}> Player {playerN}</h2>)}
      <form onSubmit={handleSubmit}>
      {playerN <= 3 && playerN > 1 && (
      <select
          className="form-select"
          value={loginMethod}
          onChange={(e) => setLoginMethod(e.target.value)}
          aria-label="Default select example"
        >
          <option value="" disabled>What do you want to play with ?</option>
          <option value="Alias">Alias</option>
          <option value="User">User</option>
        </select>)}
        {playerN == 4 && (
              <div class="alert alert-primary" role="alert" style={{position: 'relative'}}>
              Get ready for the match ! <a href="/pong3p" class="alert-link">continue</a> 
              </div>
        )}
      {loginMethod == 'User' && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: '100%' }}
        />)}
        {loginMethod == 'User' && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%' }}
        />)}
        {loginMethod == 'Alias' && (
        <input
          type="text"
          placeholder="Alias"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: '100%' }}
        />)}
        {playerN < 4 && (<button type="submit" class="btn btn-outline-secondary">Submit</button>)}
      </form>
    </div>
  );
}

export default Login3p;