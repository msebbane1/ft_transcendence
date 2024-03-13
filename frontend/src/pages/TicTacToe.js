import React, { useState , useEffect} from "react";
import useUser from "../hooks/useUserStorage";
import axios from 'axios';
import './TicTacToe.css';
import ShowTicTacToe from "./showTicTacToe";
import { Link } from 'react-router-dom';


function TicTacToeGame(){
	const user = useUser("user");
 	const [username, setUsername] = useState('');
 	const [password, setPassword] = useState('');
	const player1 = user.get("pseudo");
	const [player2, setPlayer2] = useState('');
	const [error, setError] = useState(null);
	const [shouldRenderTicTacToe, setShouldRenderTicTacToe] = useState(false);

	 const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleSubmit = async (e) => {
        e.preventDefault();
        try {
			const host = player1;
			const response = await axios.post('https://localhost:8080/api/signintournament2/', {
			  username,
			  password,
			  host,
			});
			
			const data = response.data;
			setPlayer2(username);
			setShouldRenderTicTacToe(true);
		} catch (error) {
			setError(error.response.data.error);
			setTimeout(() => setError(null), 2000);
        }
    };

	return(
		<>
			{player2 == '' && (
				<div className="pop-up-overlay">
					<div className="pop-up">
						<div className="alert alert-info" role="alert">
						{error && <p className="text-danger">{error}</p>}
						<form onSubmit={handleSubmit}>
							<p>Please connect another player</p>
							<div className="mb-3">
								<label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
								<input type="text" className="form-control" id="exampleFormControlInput1" placeholder="example: John" value={username} onChange={handleUsernameChange} />
							</div>
							<div className="mb-3">
								<label htmlFor="inputPassword5" className="form-label">Password</label>
								<input type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock" value={password} onChange={handlePasswordChange} />
								<div id="passwordHelpBlock" className="form-text">
									Your password must be 5-10 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
								</div>
							</div>
							<button type="submit" className="btn btn-primary">Submit</button>
							<Link to="/modetictactoe">
								<button type="return" className="btn btn-primary">Return</button>
							</Link>
						</form>
						</div>
					</div>
				</div>
				)}
				{ShowTicTacToe(player1, username)}
		</>
    );
}

export default TicTacToeGame