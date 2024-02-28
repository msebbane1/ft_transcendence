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
#from .jwt_generator import generate_jwt
from .two_factor_auth import generate_secret, check_valid_code, qrcode_generator
import os
from django.http import HttpResponse
import base64
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Avatar
import random
import base64
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.http import HttpResponseNotFound, FileResponse
from .convert import get_base64_from_buffer, get_base64_from_uri
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from .hash_password import hash_password
import hashlib
from django.contrib.auth.hashers import make_password, check_password

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
        user_picture = user_info.get('image', {}).get('link', None)

        try:
            user = User.objects.filter(pseudo=user_info.get('login')).first()
            first_access = False
        
            if not user:
                avatar = Avatar()
                avatar.image_url_42 = user_picture
                avatar.save()


                user, created = User.objects.get_or_create(
                pseudo=user_info.get('login'),
                defaults={
                    'username': user_info.get('login'),
                    'secret_2auth': generate_secret(access_token),
                    'wins': 0,
                    'loses': 0,
                    'avatar': avatar,}
                )
                refresh = RefreshToken.for_user(user)
                first_access = True
                user.save()
            
            refresh = RefreshToken.for_user(user)
            jwt_token = str(refresh.access_token)

            
            # AJOUTER image + image id dans user + color ball + token refresh + color paddle + score ??
            return JsonResponse({
                'id': user.id,
                'username': user.username,
                'pseudo': user.pseudo,
                '2FA_secret': user.secret_2auth,
                '2FA_valid': False,
                'avatar_update': user.avatar.avatar_update,
                'status_2FA': user.has_2auth,
                'first_access': first_access,
                'access_token': access_token,
                'avatar_id': user.avatar.id,
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

def usernameAlreadyUse(new_username):
    try:
        user_count = User.objects.filter(username=new_username).count()
        return user_count > 0
    except User.DoesNotExist:
        return False
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
        if (usernameAlreadyUse(new_username)):
            return (JsonResponse({'error': 'Le nom d\'utilisateur est déjà utliser, veuillez en choisir un autre...'}, status=400))

        try:
            user = User.objects.get(id=id)
            user.username = new_username
            user.save()

            return JsonResponse({'message': 'Nom d\'utilisateur mis à jour avec succès'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


#################################################### PASSWORD TOURNAMENT ####################################

@csrf_exempt
def create_password_tournament(request, id):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_password = data.get('new_password')
        repeat_new_password = data.get('repeatPassword')


        if new_password != repeat_new_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)
        try:
            user = User.objects.get(id=id)
            user.password_tournament = hash_password(new_password)
            user.save()

            return JsonResponse({'message': 'Le mot de passe Tournois mis à jour avec succès'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

############################################# AUTH SIGN IN SIGN UP ##########################################

#def hashed_password(password):
 #   return hashlib.sha256(password.encode()).hexdigest()

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        repeat_password = data.get('repeatPassword')

        
        existing_users = User.objects.filter(username=username) #reprendre fonction
        if existing_users.exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        if len(username) < 5:
            return JsonResponse({'error': 'Le nom d\'utilisateur doit contenir au moins 5 caractères'}, status=400)
        if len(username) > 10:
            return JsonResponse({'error': 'Le nom d\'utilisateur doit contenir au maximum 10 caractères'}, status=400)
        if len(password) < 5:
            return JsonResponse({'error': 'Le mot de passe doit contenir au moins 5 caractères'}, status=400)
        if password != repeat_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        avatar = Avatar()
        avatar.save()
    
        user = User.objects.create(
            username=username,
            password=make_password(password),
            password_tournament=make_password(password),
            register=True,
            avatar=avatar,
            wins=0,
            loses=0
        )
        user.secret_2auth = generate_secret(str(user.id))
        user.save()

        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def signin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)

        #hashed_password = make_password(password)

        #if hashed_password != user.password:
            #return JsonResponse({'error': 'Invalid password'}, status=400)
        if not check_password(password, user.password):
            return JsonResponse({'error': 'Invalid password'}, status=400)

        return JsonResponse({
            'id': user.id,
            'register': user.register,
            'username': user.username,
            '2FA_secret': user.secret_2auth,
            '2FA_valid': False,
            'status_2FA': user.has_2auth,
            'wins': user.wins,
            'avatar_id': user.avatar.id,
            'avatar_update': user.avatar.avatar_update,
            'loses': user.loses
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)



#################################################### PROFILE PICTURE ####################################
def get_avatar42_image(request, avatar_id):
    avatar = get_object_or_404(Avatar, id=avatar_id)
    image_url42 = avatar.image_url_42

    return JsonResponse({'image_url': image_url42})

def get_avatar_image(request, avatar_id):
    avatar = get_object_or_404(Avatar, id=avatar_id)
    image_url = request.build_absolute_uri(avatar.image.url)

    return JsonResponse({'image_url': image_url})

@csrf_exempt
def update_avatar_image(request, avatar_id):
    avatar = get_object_or_404(Avatar, id=avatar_id)

    if request.method == 'POST':
        
        image_file = request.FILES.get('image')
        if image_file:
            
            avatar.image = image_file
            avatar.avatar_update = True
            avatar.save()
        
            #image_url = os.path.join(settings.MEDIA_URL, str(avatar.image))
            image_url = avatar.image.url
            return JsonResponse({'message': 'Image updated successfully', 'image_url': image_url})
        
        else:
            return JsonResponse({'error': 'No image provided'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



