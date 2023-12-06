import ProfileTest from './ProfileTest';
import './profil.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useSession from './hooks/useSession';

const Profil = () => {
  const [onglet, setOnglet] = useState("history");
  const session = useSession("session");
  const [user, setUser] = useState({});
  const { id } = useParams();

  let fetchSession = () => setUser(session.value);
  let fetchUser = async () => {
    let res = await fetch(`http://localhost:3030/users/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${session.get("request_token")}`,
        'Content-Type': 'application/json'
      }
    });
    let data = await res.json();
    if (data.error) return;
    setUser(data);
  };

  useEffect(() => {
    setOnglet("history");
    if (!id) return fetchSession();
    fetchUser();
  }, [id]);

  return (
    <main className="profil">
      <ProfileTest user={user} />
    </main>
  );
};

export default Profil;

