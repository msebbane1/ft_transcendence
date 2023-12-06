import Avatar from './pages/Avatar';
import './profil.css';
import useSession from './hooks/useSession';
import { useEffect, useState } from 'react';

const ProfileTest = (props) => {
  const { user } = props;
  const [stats, setStats] = useState({});
  const session = useSession("session");

  const fetchStats = async () => {
    const response = await fetch(`http://localhost:8080/users`, { // A CHANGER
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.get("request_token")}`,
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    if (data) setStats(data);
  };

  useEffect(() => {
    if (!user.id) return;
    fetchStats();
  }, [user.id]);

  return (
    <div className="profil_header_avatar">
      <Avatar width="300px" height="300px" user={user.id} />
    </div>
  );
};

export default ProfileTest;

