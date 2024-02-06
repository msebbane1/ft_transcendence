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
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

######################################################### .ENV #########################################################
load_dotenv()
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
#REDIRECT_URIS = os.getenv('REDIRECT_URIS').split(',')

######################################################### USER DATA ##################################################

###### AUTHORIZE URL ######
# optimiser
@csrf_exempt
def get_authorize_url(request):
    if request.method == 'POST':
        authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code'
        return JsonResponse({'authorization_url': authorization_url})
    
    return JsonResponse({'error': 'Methode non autorisée'}, status=405)
    

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
            user = User.objects.filter(pseudo=user_info.get('login')).first()
            first_access = False
            #user.delete() si je dois modifier user
            if not user:
                user, created = User.objects.get_or_create(
                pseudo=user_info.get('login'),
                defaults={
                    'id': user_info.get('id'),
                    'username': user_info.get('login'),
                    'secret_2auth': generate_secret(access_token),
                    'wins': 0,
                    'loses': 0,}
                )
                refresh = RefreshToken.for_user(user)
                first_access = True
                user.save()
            
            refresh = RefreshToken.for_user(user)
            jwt_token = str(refresh.access_token)
            # AJOUTER image + image id dans user + email + color ball + token refresh + color paddle + score ??
            return JsonResponse({
                'id': user.id,
                'username': user.username,
                'pseudo': user.pseudo,
                '2FA_secret': user.secret_2auth,
                '2FA_valid': False,
                'status_2FA': user.has_2auth,
                'first_access': first_access,
                'access_token': access_token,
                'jwt_token': jwt_token
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
        try:
            user = User.objects.get(secret_2auth=secret)
            user.has_2auth = True
            user.save()

            return JsonResponse({'status': True})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
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

      #  try:
       #     user = User.objects.get(secret_2auth=secret)
        #    user.has_2auth = True
         #   user.save()

          #  return JsonResponse({'message': 'Enable 2FA avec succès'}, status=200)
        #except User.DoesNotExist:
         #   return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)


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
        try:
            user = User.objects.get(secret_2auth=secret)
            user.has_2auth = False
            user.save()

            return JsonResponse({'status': True})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
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


######################################################## UPDATE USERNAME ############################################
@csrf_exempt
def update_username(request, id):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_username = data.get('username', '')

        if not new_username:
            return JsonResponse({'error': 'Veuillez entrer un nom d\'utilisateur'}, status=400)
        if len(new_username) < 5:
            return JsonResponse({'error': 'Le nom d\'utilisateur doit contenir au moins 5 caractères'}, status=400)
        if len(new_username) > 10:
            return JsonResponse({'error': 'Le nom d\'utilisateur doit contenir au maximum 10 caractères'}, status=400)
        if not new_username.isalpha():
            return JsonResponse({'error': 'Le nom d\'utilisateur ne peut contenir que des lettres'}, status=400)

        try:
            user = User.objects.get(id=id)
            user.username = new_username
            user.save()

            return JsonResponse({'message': 'Nom d\'utilisateur mis à jour avec succès'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
