import { useState, useEffect } from 'react';

export default function useSession2(key: string) {
  const [session, setSession] = useState<Record<string, any>>({});

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

  const has = (field: string) => {
    return field in session;
  };

  const get = (field: string) => {
    return session[field];
  };

  const set = (data: Record<string, any>) => {
    setSession({ ...session, ...data });
  };

  const clear = () => {
    setSession({});
  };

  return { has, get, set, clear };
}

