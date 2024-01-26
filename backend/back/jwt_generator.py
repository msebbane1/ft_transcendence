# jwt_generator.py
import jwt
from datetime import datetime, timedelta

SECRET_KEY = 'votre_clé_secrète'  # Remplacez par votre propre clé secrète

def generate_jwt(username, user_id):
    # Configurez les réclamations (payload) du JWT
    payload = {
        'username': username,
        'sub': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)  # Ajoutez une expiration d'une journée
    }

    # Générez le JWT en signant le payload avec la clé secrète
    jwt_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return jwt_token.decode('utf-8')  # Décodez le résultat en UTF-8 si nécessaire

