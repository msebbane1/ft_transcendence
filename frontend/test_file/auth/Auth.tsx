//Verifier toute les conditions pour l'authentification (Redirection vers d'autres pages)
import { ReactNode, useState } from "react";
import { useLocation, Navigate, matchPath } from "react-router-dom";

export const RedirectWhenAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  if (
    matchPath(location.pathname, "/auth/signin") &&
    localStorage!.getItem("userLogged") === "true"
  )
    return (
      <Navigate to="/app/private-profile" state={{ from: location }} replace />
    );
  return children;
};

