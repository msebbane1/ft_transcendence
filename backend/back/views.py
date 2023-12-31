from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
#from django.views.decorators.cors import cors_headers
from oauth2_provider.models import Application
from requests import post
from django.conf import settings
import json
from json.decoder import JSONDecodeError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.http import require_POST
from django.views.decorators.http import require_GET
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from django.views import View
import requests
from dotenv import load_dotenv
import os


load_dotenv()
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')

# authorizeUrl en POST
def AuthUrl(request):
    authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code'
    return JsonResponse({'authorization_url': authorization_url})
    
# A MODIFIER a rajouter csrf
# getTokenUser
@csrf_exempt
def RequestForToken(request):

   # def get(self, request) pour View

    if request.method == 'POST':
        data = json.loads(request.body)
        code = data.get('code')
        token_url = 'https://api.intra.42.fr/oauth/token/'
        response = requests.post(
                token_url,
                data={
                    'client_id': CLIENT_ID,
                    'client_secret': CLIENT_SECRET,
                    'code': code,
                    'redirect_uri': REDIRECT_URI,
                    'grant_type': 'authorization_code',
                }
            )
        #if response.json():
        try:
            access_token = response.json().get('access_token')
            response_data = response.json()

            return JsonResponse({'authenticated': True, 'access_token': access_token})

        except json.decoder.JSONDecodeError as e:
            return JsonResponse({'error': 'Failed to decode JSON response'}, status=500)
        #else:
         #   return JsonResponse({'error': 'Failed to obtain access token no response :c'}, status=response.status_code)

    if request.method == 'GET':
        return JsonResponse({'message': 'GET request received'})

# A MODIFIER GET
# getInformationsUser
@require_GET
def get_profile_image(request):
    # Récupérer le token d'accès depuis l'en-tête de la requête
    access_token = request.headers.get('Authorization', '').split('Bearer ')[-1]

    # Faire une requête à l'API de 42 pour récupérer l'image de profil
    response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})

    if response.status_code == 200:
        profile_data = response.json()
        image_url = profile_data.get('image_url')
        if image_url:
            image_response = requests.get(image_url)
            return JsonResponse({'image': image_response.content.decode('latin-1')}, status=image_response.status_code)

    return JsonResponse({'error': 'Erreur lors de la récupération de l\'image de profil'}, status=response.status_code)

