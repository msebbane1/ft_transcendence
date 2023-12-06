import { useState, useEffect } from 'react';

export default function useSession2(key) {
  const [session, setSession] = useState({});

  // Charger les données de session depuis localStorage lors du chargement du composant
  useEffect(() => {
    const savedSession = localStorage.getItem(key);
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        setSession(parsedSession);
      } catch (error) {
        console.error('Erreur lors de la lecture des données de session depuis localStorage:', error);
      }
    }
  }, [key]);

  // Enregistrer les données de session dans localStorage chaque fois qu'elles changent
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(session));
  }, [key, session]);

  const has = (field) => {
    return field in session;
  };

  const get = (field) => {
    return session[field];
  };

  const set = (data) => {
    setSession({ ...session, ...data });
  };

  const clear = () => {
    setSession({});
  };

  // Ajoutez une vérification pour l'access token
  const isAuthenticated = () => {
    return has('accessToken');
  };

  return { has, get, set, clear, isAuthenticated };
}

