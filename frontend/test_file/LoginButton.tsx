import * as React from "react";
import useSession from "./hooks/useSession";
import Img from './assets/3.png';
import './Logintest.css';

const LoginButton = () => {
	const session = useSession("session");

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { hostname, port } = document.location;

    e.preventDefault();

    let request = await fetch('http://localhost:3030/auth/authorize', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.get("request_token")}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ redirect_uri: `http://${hostname}:${port}/callback` })
    });

    if (request.status === 200 && request.headers.get('content-type')?.includes('application/json')) {
        let response = await request.json();
        document.location.href = response.url;
    } else {
        console.error('Invalid response from the server.');
console.log('Server Response:', request.status, request.statusText);
console.log('Response Headers:', request.headers);
        // Gérer la réponse non JSON ici
    }
};


	return (
    <div>
      <img
      src={Img} className="centered-image" />
      <button className="login-button" onClick={handleClick}>Login</button>
    </div>
  );
}


export default LoginButton;
