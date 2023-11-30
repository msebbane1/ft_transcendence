// 42LoginButton.tsx

import React from 'react';
import axios from 'axios';

const _42LoginButton: React.FC = () => {
    const handleLogin = async () => {
        try {
            const response = await axios.get('http://localhost:8080/auth/42/', {
                params: {
                    redirect_uri: 'http://localhost:3000/callback',
                },
            });
            window.location.href = response.data.authorization_url;
        } catch (error) {
            console.error('Erreur lors de la connexion avec 42:', error);
	    console.log('Détails de l\'erreur:', error);
        }
    };

    return (
        <button onClick={handleLogin}>Connexion avec 42</button>
    );
};

export default _42LoginButton;

