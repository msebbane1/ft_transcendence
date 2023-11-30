import axios from 'axios';

const Login42 = () => {
    const handleLogin = async () => {
        try {
            // 1. Effectuez une requête pour générer l'URL d'authentification 42
            const responseUrl = await axios.get('http://localhost:8080/auth/');
            console.log('Réponse du backend (URL) :', responseUrl);
	    console.log('URL d\'authentification 42 générée :', responseUrl.data.authorization_url);

        // Redirigez explicitement l'utilisateur vers l'URL d'authentification 42
            if (responseUrl.data.authorization_url){
		window.location.href = responseUrl.data.authorization_url;
            } 
	    else {
                console.log('Réponse URL', responseUrl.data);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification 42 LOGIN:', error);
        }
    };

    return (
        <body className="back">
            <div className="text-container">
                <p className="text-pong"> &gt; pong</p>
                <p className="text-game"> Game </p>
            </div>
            <div className="container_ft">
                <p className="text-ft2">  &gt; </p> <p className="text-ft">  ft_transcendence/pongGame </p>
            </div>
            <button className="login-button" onClick={handleLogin}>Login</button>
        </body>
    );
};

export default Login42;

