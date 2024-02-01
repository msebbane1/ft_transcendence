from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
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
### AUTH
from .auth_access_token import get_access_token
from .auth_user_infos import get_user_info
from .jwt_generator import generate_jwt
from .two_factor_auth import generate_secret, check_valid_code, qrcode_generator
import os
from django.http import HttpResponse
import base64
import pyotp

######################################################### .ENV #########################################################
load_dotenv()
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
#REDIRECT_URIS = os.getenv('REDIRECT_URIS').split(',')

######################################################### USER DATA ##################################################

###### AUTHORIZE URL ######
# A CHANGER en POST et a optimiser
def get_authorize_url(request):
        authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code'
        return JsonResponse({'authorization_url': authorization_url})
    

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
            return JsonResponse({'error': 'Image de profil indisponible'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#### INFOS USER ####
## A changer en get ??
@csrf_exempt
def get_infos_user(request):
    if request.method == 'POST':
        access_token = request.headers.get('Authorization').split(' ')[1]
        response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
        data = response.json()

        if data:
            return JsonResponse(data)
        else:
            return JsonResponse({'error': 'Infos user indisponible'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#### ALL DATA USER ##
@csrf_exempt
def get_all_user_data(request):

    if request.method == 'POST':
        data = json.loads(request.body)
        code = data.get('code')

        access_token = get_access_token(CLIENT_ID, CLIENT_SECRET, code, REDIRECT_URI)

        user_info = get_user_info(access_token)

        try:
            # IMPLEMENTER un noouvel User dans la base de donnée :
            #user = User.objects.filter(username=user_info.get('login')).first()
            #first_access = False

            #if not user:
                # Si l'utilisateur n'existe pas : new User :
            #user = User(
             #   username=user_info.get('login'),
              #  
               # _2FA_secret=generate_secret(access_token),
                #_2FA_status=False,
            #)
            _2FA_secret = generate_secret(access_token)
            #jwt_token = generate_jwt(user_info.get('login'), user_info.get('id'))
            first_access = True # Mettre a false et mettre a true si l'user n'existe pas dans la bdd
            # AJOUTER image + email ??
            return JsonResponse({
                'id': user_info.get('id'),
                '42_username': user_info.get('login'),
                'username': user_info.get('login'),
                '2FA_secret': _2FA_secret,
                '2FA_valid': False, # A mettre dans la base donnee de l'user (ne pas mettre a false)
                'status_2FA': False,
                'first_access': first_access,
                'access_token': access_token,
                'refresh_token': 'example_refresh_token', 
                'jwt_token': "jwt_token",
                'color_paddle': 'example_color_paddle',
                'color_ball': 'example_color_ball',
})

        except json.decoder.JSONDecodeError as e:
            return JsonResponse({'error': 'Reponse JSON et access_token indisponible'}, status=500)

    if request.method == 'GET':
        return JsonResponse({'message': 'GET request received'})

##################################################### TWO FACTOR AUTH ###########################################


@csrf_exempt
def validate_2fa(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        secret = data.get('secret')
        code = data.get('code')

        if not secret or not code or not check_valid_code(secret, code):
            return JsonResponse({'status': False})
        # if secret != code:
        #    return JsonResponse({'status': False})
        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)



@csrf_exempt
def enable_2fa(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        secret = data.get('secret')
        code = data.get('code')

        if not secret or not code or not check_valid_code(secret, code):
            return JsonResponse({'status': False})

        # Ajouter et mettre à jour la base de données et activer la 2FA
        # Exemple : user_info['2FA_status'] = True
        #          save_user_info(user_info)

        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def disable_2fa(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        secret = data.get('secret')

        if not secret:
            return JsonResponse({'status': False})

        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def get_qrcode(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        secret = data.get('secret')

        image_content = qrcode_generator(username, secret)
        buffer = base64.b64decode(image_content)

        response = HttpResponse(buffer, content_type="image/png")
        response['Content-Disposition'] = f'inline; filename="qrcode.png"'
        return response
    else:
        return JsonResponse({'error': str(e)}, status=500)
