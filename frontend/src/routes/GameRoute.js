
import React, { useState } from 'react';
import { RedirectGame } from '../components/RedirectApp';
import useUser from '../hooks/useUserStorage';

const GameRoute = ({ children }) => {
  const user = useUser("user");
  const [loading, setLoading] = useState(true);

  const handleLoadingFinish = () => {
    setLoading(false);
  };

  return (
    <>
      <RedirectGame user={user} onLoadingFinish={handleLoadingFinish} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        children
      )}
    </>
  );
};

export default GameRoute;

