import jwt
import datetime
from functools import wraps
from django.conf import settings
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError

def jwt_token_required(view_func):
    def wrapped_view(request, *args, **kwargs):
        jwt_token = request.headers.get('Authorization', None)
        if jwt_token:
            try:
                decoded_token = jwt.decode(jwt_token.split()[1], settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
                expiration_time = decoded_token.get('exp', None)
                if expiration_time:
                    current_time = datetime.datetime.utcnow().timestamp()
                    if current_time > expiration_time:
                        return JsonResponse({'error': 'JWT token expired'}, status=401)
                return view_func(request, *args, **kwargs)
            except jwt.exceptions.DecodeError:
                return JsonResponse({'error': 'Invalid JWT Token'}, status=401)
        else:
            return JsonResponse({'error': 'Missing JWT Token'}, status=401)
    return wrapped_view

def oauth2_token_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        access_token = request.headers.get('Authorization', None)
        if access_token:
            try:
                headers = {'Authorization': access_token}
                response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
                
                if response.status_code == 200:
                    return view_func(request, *args, **kwargs)
                else:
                    return JsonResponse({'error': 'Invalid OAuth2 token'}, status=401)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'Missing OAuth2 Token'}, status=401)
    return wrapped_view



def refresh_token_requiredd(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        refresh_token = request.headers.get('Authorization', None)
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.verify()
                return view_func(request, *args, **kwargs)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Refresh token expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid refresh token'}, status=401)
        else:
            return JsonResponse({'error': 'Missing refresh token'}, status=401)
    return wrapped_view



def refresh_token_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        jwt_authentication = JWTAuthentication()
        try:
            user, token = jwt_authentication.authenticate(request)
            if not token.access_token:
                return view_func(request, *args, **kwargs)
            else:
                return JsonResponse({'error': 'Refresh token required'}, status=401)
        except TokenError as e:
            return JsonResponse({'error': str(e)}, status=401)
    return wrapped_view
