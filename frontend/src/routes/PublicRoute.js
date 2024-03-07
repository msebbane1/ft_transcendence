import React from "react";
import { RedirectPublic } from '../components/RedirectApp';
import useUser from '../hooks/useUserStorage';

const PublicRoute = ({ children }) => {
	const user = useUser("user");
  return (
    <>
      <RedirectPublic user={user} />
      {children}
    </>
  );
};

export default PublicRoute;
