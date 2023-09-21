import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = (session: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Votre logique de redirection ici
    let challenge = !session.get("2FA_status") || session.get("2FA_challenge");
    if (challenge && session.has("access_token")) {
      navigate("/home");
    }
  }, [session, navigate]);

  // Vous pouvez également retourner d'autres informations si nécessaire
  return {
    // Par exemple, vous pouvez retourner un indicateur si la redirection a été effectuée
    redirectToHome: false, // Mettez à jour cela en fonction de votre logique
  };
};

