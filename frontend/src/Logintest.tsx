import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import useSession from './hooks/useSession';
import './Logintest.css';
import LoginButton from './LoginButton';
import Img from './assets/3.png';

const Logintest = (props: any) => {
        const session = useSession("session");
        const [params] = useSearchParams();
        const [loading, setLoading] = useState(false)

        useEffect(() => {
                const code = params.get("code")
                const {hostname, port} = document.location
                if (code && !session.has("access_token"))
                {
                        setLoading(true)
                        const request = fetch('http://localhost:3030/auth/authorize', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                        'cors': 'true'
                                },
                                body: JSON.stringify({redirect_uri: `http://${hostname}:${port}`})
                        })
                        request.then(response => response.json().then((res: any) => {
                                session.setAll({...res})
                        }))
                        request.catch(e => {console.error(e)})
                }
                return () => {}
        }, [])

        useEffect(() => {
                const {hostname, port} = document.location
                const connected = session.has("access_token")
                if (connected)
                {
                        setTimeout(() => {
                           document.location.href = `http://${hostname}:${port}/home`;
                        }, 500)
                }

        }, [session])
return (
    <div>
      <p>Authentification en cours...</p>
      <LoginButton/>
    </div>
  );
};

export default Logintest;
