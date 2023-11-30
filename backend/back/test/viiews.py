# views.py

from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from oauth2_provider.models import Application
from requests import post

@login_required
def home(request):
    return JsonResponse({'message': 'Welcome to the home page!'})

def login_42(request):
    # Configurez une application OAuth 2.0 sur le site 42 et remplacez ces valeurs
    client_id = 'SOCIAL_AUTH_42_KEY'
    client_secret = 'YOUR_42_CLIENT_SECRET'
    redirect_uri = ''

    # URL d'authentification 42
    authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=public'
    
    return redirect(authorization_url)

@csrf_exempt
def callback_42(request):
    if 'code' in request.GET:
        # Échanger le code contre le jeton d'accès
        token_url = 'https://api.intra.42.fr/oauth/token'
        token_data = {
            'client_id': 'YOUR_42_CLIENT_ID',
            'client_secret': 'YOUR_42_CLIENT_SECRET',
            'code': request.GET['code'],
            'redirect_uri': 'http://localhost:8000/login/42/callback/',
            'grant_type': 'authorization_code',
        }

        response = post(token_url, data=token_data)
        response_data = response.json()

        # Vérifier si l'échange du code a réussi
        if 'access_token' not in response_data:
            return JsonResponse({'error': 'Authentication failed'})

        # Utilisateur 42 associé au jeton d'accès
        user_info_url = 'https://api.intra.42.fr/v2/me'
        headers = {'Authorization': f'Bearer {response_data["access_token"]}'}
        user_info_response = post(user_info_url, headers=headers)
        user_info = user_info_response.json()

        # Créer ou récupérer l'utilisateur Django associé à l'utilisateur 42
        user, created = User.objects.get_or_create(username=user_info['login'])
        user.set_unusable_password()
        user.save()

        return JsonResponse({'authenticated': True})
    
    return JsonResponse({'error': 'Authentication failed'})

