import React, { useState } from 'react';
import { RedirectPrivate } from '../components/RedirectApp';
import useUser from '../hooks/useUserStorage';

const PrivateRoute = ({ children }) => {
	const user = useUser("user");
  const [loading, setLoading] = useState(true);

  const handleLoadingFinish = () => {
    setLoading(false);
  };

  return (
    <>
      <RedirectPrivate user={user} onLoadingFinish={handleLoadingFinish} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        children
      )}
    </>
  );
};

export default PrivateRoute;
