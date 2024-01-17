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

### .ENV ###
load_dotenv()
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
REDIRECT_URIS = os.getenv('REDIRECT_URIS').split(',')

###### AUTHORIZE URL ######
# authorizeUrl en POST A CHANGER
def AuthUrl(request):
    authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code'
    return JsonResponse({'authorization_url': authorization_url})
    
# A MODIFIER a rajouter csrf
# getTokenUser
###### GET TOKEN USER ####
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

##### PHOTO DE PROFILE INTRA ####
@csrf_exempt
def get_profile_image(request):
    if request.method == 'POST':
        access_token = request.headers.get('Authorization').split(' ')[1]
        response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
        data = response.json()
        
        image_url = data.get('image', {}).get('link', None)

        if image_url:
            return JsonResponse({'image_url': image_url})
        else:
            return JsonResponse({'error': 'Aucune image de profil disponible'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#### INFOS USER ####
@csrf_exempt
def get_infos_user(request):
    if request.method == 'POST':
        access_token = request.headers.get('Authorization').split(' ')[1]
        response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
        data = response.json()

        if data:
            return JsonResponse(data)
        else:
            return JsonResponse({'error': 'Aucune image de profil disponible'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

