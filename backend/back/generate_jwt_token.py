import datetime
import jwt
from django.http import JsonResponse
from django.conf import settings

def generate_jwt_token42(user_info):
    payload = {
        'id': user_info.get('id'),
        'email': user_info.get('email'),
        'username': user_info.get('username'),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }

    jwt_token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return jwt_token

def generate_jwt_token(user):
    payload = {
        'id': user.id,
        'username': user.username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }

    jwt_token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return jwt_token
