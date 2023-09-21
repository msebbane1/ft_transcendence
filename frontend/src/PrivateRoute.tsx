import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  path: string; // Ajoutez le chemin ici
  element: React.ReactNode;
  authenticated: boolean;
}

function PrivateRoute({ element, authenticated, ...rest }: PrivateRouteProps) {
  return authenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default PrivateRoute;

