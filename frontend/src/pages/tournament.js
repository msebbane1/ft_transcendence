import React, { useState, useEffect } from 'react';
import useUser from "../hooks/useUserStorage";
import axios from 'axios';
import { Link } from 'react-router-dom';
import './tournament.css';

var   playerN = 2;
var   userArray = [];

userArray.push(['alias1', "- ", "user"]);
userArray.push(['alias2', "- 1234", "none"]);
userArray.push(['alias3', "- 4321", "none"]);
userArray.push(['alias4', "- 234234", "none"]);

const Tournament = () => {
  
  const user = useUser("user");
  const p1 = user.get("pseudo");
  const toAdd = user.get("username");
  userArray[0][1] = p1;
  localStorage.setItem('alias1', toAdd+ "@+User");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState('');
  const [error, setError] = useState(null);


  const areValuesUnique = (value1, value2, value3, value4, value5) => {
    return value1 !== value2 && value1 !== value3 && value1 !== value4 &&
           value2 !== value3 && value2 !== value4 && value5 !== value4 &&
           value3 !== value4 && value5 !== value3 && value2 !== value5 &&
           value5 !== value1;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const toadd = 'alias' + playerN;
    var  tocheck = username;
    if(loginMethod == 'Alias')
    {
      axios.post('https://localhost:8080/api/checkalias/', {
        username,
      })
      .then(response => {
        const data = response.data;
        user.set("pongAccess", 'pongtournament');

        setUsername('');
        setPassword('');
        setLoginMethod('');
        if(username && areValuesUnique(userArray[0][1], userArray[1][1], userArray[2][1], userArray[3][1], data.username)) {
          localStorage.setItem(toadd, data.username+"@+Alias");
          userArray[playerN-1][1] = data.username;
          playerN += 1;
        } else {
          setError("Alias/Username already in use.");
          setTimeout(() => setError(null), 2000);
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setError(error.response.data.error);
          setTimeout(() => setError(null), 2000);
        } else {
            alert("An error occurred while processing your request.");
        }});
  }
  else if (loginMethod === 'User')
  {
    const host = p1;
    axios.post('https://localhost:8080/api/signintournament/', {
      username,
      password,
      host,
    })
    .then(response => {
      const data = response.data;
      user.set("pongAccess", 'pongtournament');
      setUsername('');
      setPassword('');
      setLoginMethod('');
      
      if(username && areValuesUnique(userArray[0][1], userArray[1][1], userArray[2][1], userArray[3][1], data.username)) {
        localStorage.setItem(toadd, data.username+"@+User");
        userArray[playerN-1][1] = data.username;
        playerN += 1;
      } else {
        setError("User/Alias doesn't exist or already in use.");
          setTimeout(() => setError(null), 2000);
      }
    })
    .catch(error => {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
        setTimeout(() => setError(null), 2000);
      } else {
          alert("An error occurred while processing your request.");
      }});
    };
  }
  return (
    <div className="container">
      {playerN < 5 && (<h2 style={{color:'white'}}> Player {playerN}</h2>)}
      <form onSubmit={handleSubmit}>
      {playerN <= 4 && playerN > 1 && (
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
        {playerN == 5 && (
              <div className="alert alert-primary" role="alert" style={{position: 'relative'}}>
              Tournament is ready ! <a href="/tournamentPong" className="alert-link">continue</a> 
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
        {playerN < 5 && (<button type="submit" className="btn btn-outline-secondary">Submit</button>)}
      </form>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default Tournament;


// V1


// const Tournament = () => {
//   const user = useUser("user");
//   const p1 = user.get("username");
//   const [alias1, setAlias1] = useState('');
//   const [alias2, setAlias2] = useState('');
//   const [alias3, setAlias3] = useState('');
//   const [alias4, setAlias4] = useState('');
//   var   finalAlias1;

//   const areValuesUnique = (value1, value2, value3, value4) => {
//     return value1 !== value2 && value1 !== value3 && value1 !== value4 &&
//            value2 !== value3 && value2 !== value4 &&
//            value3 !== value4;
//   };

//   const handleSubmit = () => {
//     finalAlias1 = alias1.trim() ? alias1 : p1; 
//     if (alias2 && alias3 && alias4) {

//       if(areValuesUnique(finalAlias1, alias2, alias3, alias4))
//       {
//         localStorage.setItem('alias1', finalAlias1);
//         localStorage.setItem('alias2', alias2);
//         localStorage.setItem('alias3', alias3);
//         localStorage.setItem('alias4', alias4);
//       }
//       else{
//         alert("Veuillez remplir tous les champs d'alias sans doublons. (1er facultatif)");
//       }
//     } else {
//       alert("Veuillez remplir tous les champs d'alias. (1er facultatif)");
//     }
//   };

//   return (
//     <div>
//       <div className="container">
//         <input
//           type="text"
//           placeholder="Alias 1"
//           value={alias1}
//           onChange={(e) => setAlias1(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Alias 2"
//           value={alias2}
//           onChange={(e) => setAlias2(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Alias 3"
//           value={alias3}
//           onChange={(e) => setAlias3(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Alias 4"
//           value={alias4}
//           onChange={(e) => setAlias4(e.target.value)}
//         />
//         <Link to={areValuesUnique(localStorage.getItem(`alias${0}`), alias2, alias3, alias4) && alias2 && alias3 && alias4 ? "/tournamentPong" : "/tournament"} onClick={handleSubmit} disabled={!(alias1 && alias2 && alias3 && alias4)}>
//           Start Game
//         </Link>
//         <Link to="/modepong">Cancel</Link>
//         </div>
//             <select class="form-select" aria-label="Default select example">
//               <option selected>How do you want to log ?</option>
//               <option value="Alias"></option>
//               <option value="User"></option>
//             </select>
//     </div>    
//   );
// };

// export default Tournament;
