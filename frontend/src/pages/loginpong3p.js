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
    const toadd = 'alias' + playerN;
    var  tocheck = username.trim();
    if(loginMethod == 'Alias')
    {

      if(username && areValuesUnique(userArray[0][1], userArray[1][1], userArray[2][1], tocheck))
      {
        localStorage.setItem(toadd, tocheck+"@+Alias");
        userArray[playerN-1][1] = tocheck;
        playerN += 1;
        console.log(userArray);
      }
      else{
        alert("User/Alias doesn't exist or already in use");
      }
      setUsername('');
      setPassword('');
      setLoginMethod('');
      if(playerN == 4)
        settingOver = true;
  }
  else if (loginMethod === 'User')
  {
      try {
        const response = await axios.post('https://localhost:8080/api/signin/', {
        username,
        password,
        });
        const data = response.data;
        setUsername('');
        setPassword('');
        setLoginMethod('');
      } 
      catch (error) {
        console.error('Error submitting form:', error);
          alert("User/Alias doesn't exist or already in use.");
          return;
        } 
      if(username && areValuesUnique(userArray[0][1], userArray[1][1], userArray[2][1], tocheck))
      {
        localStorage.setItem(toadd, tocheck+"@+User");
        userArray[playerN-1][1] = tocheck;
        playerN += 1;
        console.log(userArray);
      }
      else
        alert("User/Alias doesn't exist or already in use.");
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