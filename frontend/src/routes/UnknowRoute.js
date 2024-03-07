import React from "react";
import { RedirectUnknow } from '../components/RedirectApp';
import useUser from '../hooks/useUserStorage';

const UnknowRoute = ({ children }) => {
	const user = useUser("user");
  return (
    <>
      <RedirectUnknow user={user} />
      {children}
    </>
  );
};

export default UnknowRoute;