from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from rest_framework import status
from django.views import View
import requests
import os
import json
import base64
from django.http import HttpResponse
from dotenv import load_dotenv
### AUTH Utils
from .auth_access_token import get_access_token
from .auth_user_infos import get_user_info
from .two_factor_auth import generate_secret, check_valid_code, qrcode_generator
from .generate_jwt_token import generate_jwt_token
from .utils import usernameAlreadyUse, pseudoAlreadyUse
from back.decorators import jwt_token_required, refresh_token_required, oauth2_token_required
from back.models import User, Avatar

######################################################### .ENV #########################################################
load_dotenv()
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
#REDIRECT_URIS = os.getenv('REDIRECT_URIS').split(',')

######################################################### SIGN IN USER 42 ##################################################

###### AUTHORIZE URL ######
# optimiser Mettre Oauth2 ?
@csrf_exempt
@require_POST
def get_authorize_url(request):
    if request.method == 'POST':
        authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code'
        return JsonResponse({'authorization_url': authorization_url})
    
    return JsonResponse({'error': 'Unauthorized method'}, status=405)
    

##### PHOTO DE PROFILE INTRA ####
@csrf_exempt
@oauth2_token_required
def get_profile_image(request):
    if request.method == 'POST':
        access_token = request.headers.get('Authorization').split(' ')[1]
        response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
        data = response.json()
        
        image_url = data.get('image', {}).get('link', None)

        if image_url:
            return JsonResponse({'image_url': image_url})
        else:
            return JsonResponse({'error': 'Profile picture unavailable'}, status=400)

    return JsonResponse({'error': 'Unauthorized method'}, status=405)

#### INFOS USER ####
@csrf_exempt
@oauth2_token_required
def get_infos_user(request):
    if request.method == 'POST':
        access_token = request.headers.get('Authorization').split(' ')[1]
        response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
        data = response.json()

        if data:
            return JsonResponse(data)
        else:
            return JsonResponse({'error': 'User information unavailable'}, status=400)

    return JsonResponse({'error': 'Unauthorized method'}, status=405)

########################################################### LOGIN 42 #################################################################33
@csrf_exempt
def login42(request):

    if request.method == 'POST':
        data = json.loads(request.body)
        code = data.get('code')

        access_token = get_access_token(CLIENT_ID, CLIENT_SECRET, code, REDIRECT_URI)

        user_info = get_user_info(access_token)
        user_picture = user_info.get('image', {}).get('link', None)

        try:
            user = User.objects.filter(pseudo=user_info.get('login')).first()
            if not user:
                avatar = Avatar()
                avatar.image_url_42 = user_picture
                avatar.save()

                user, created = User.objects.get_or_create(
                pseudo=user_info.get('login'),
                defaults={
                    'username': user_info.get('login'),
                    'secret_2auth': generate_secret(access_token),
                    'status': "online",
                    #'token_auth': access_token,
                    'register': False,
                    'avatar': avatar,}
                )
                refresh = RefreshToken.for_user(user)
                user.save()
            
            refresh = RefreshToken.for_user(user)
            #user.jwt_token = str(refresh.access_token)
            user.status = "online"
            user.register = False
            user.token_jwt = generate_jwt_token(user)
            user.save()
            #jwt_token = generate_jwt_token(user)

            return JsonResponse({
                'id': user.id,
                'username': user.username,
                'pseudo': user.pseudo,
                '2FASecret': user.secret_2auth,
                '2FAValid': False,
                'avatar_update': user.avatar.avatar_update,
                'status2FA': user.has_2auth,
                'access_token': access_token,
                'refresh_token': str(refresh),
                'avatar_id': user.avatar.id,
                'status': user.status,
                #'jwt_token': user.token_jwt
})

        except json.decoder.JSONDecodeError as e:
            return JsonResponse({'error': 'JSON response and access token unavailable'}, status=500)

    if request.method == 'GET':
        return JsonResponse({'message': 'GET request received'})

############################################################ AUTH SIGN IN SIGN UP ##########################################

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        repeat_password = data.get('repeatPassword')

        if not username:
            return JsonResponse({'emptyName': False})
        if len(username) < 5:
            return JsonResponse({'lenminName': False})
        if len(username) > 10:
            return JsonResponse({'lenmaxName': False})
        if not username.isalpha():
            return JsonResponse({'alphaName': False})
        if (usernameAlreadyUse(username)) or (pseudoAlreadyUse(username)):
            return (JsonResponse({'nameAlreadyUse': False}))

        if not password:
            return JsonResponse({'emptyPass': False})
        if len(password) < 5:
            return JsonResponse({'lenminPass': False})
        if len(password) > 10:
            return JsonResponse({'lenmaxPass': False})
        if password != repeat_password:
            return JsonResponse({'repeat': False})

        avatar = Avatar()
        avatar.save()
    
        user = User.objects.create(
            username=username,
            pseudo=username,
            password=make_password(password),
            password_tournament=make_password(password),
            register=True,
            avatar=avatar
        )
        user.token_jwt = generate_jwt_token(user)
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
            user = User.objects.get(pseudo=username)
        except User.DoesNotExist:
            return JsonResponse({'Namedontexist': False})
        if not username.isalpha():
            return JsonResponse({'alphaName': False})
        if not user.password:
            return JsonResponse({'nopassword': False})
        elif not check_password(password, user.password):
            return JsonResponse({'checkpassword': False})
        
        #user_auth = authenticate(request, username=username, password=password)
        #if user_auth is not None:
            #login(request, user)

        user.status = "online"
        user.save()

        #jwt_token = generate_jwt_token(user)

        return JsonResponse({
            'id': user.id,
            'register': user.register,
            'username': user.username,
            'pseudo': user.pseudo,
            '2FASecret': user.secret_2auth,
            '2FAValid': False,
            'status2FA': user.has_2auth,
            'avatar_id': user.avatar.id,
            'avatar_update': user.avatar.avatar_update,
            'status': user.status,
            'statusIn': True,
            #'jwt_token': user.token_jwt,
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

##################################################### LOGOUT ###########################################

@csrf_exempt
def logout(request, id):
    if request.method == 'POST':
        #logout(request)

        try:
            user = User.objects.get(id=id)
            user.status = "offline"
            user.save()

            return JsonResponse({'success': 'Successful disconnection'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


#################################################### TWO FACTOR AUTH ###########################################

@csrf_exempt
@jwt_token_required
def validate_2fa(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        secret = data.get('secret')
        code = data.get('code')

        if not secret or not code or not check_valid_code(secret, code):
            return JsonResponse({'status': False})
        try:
            user = User.objects.get(secret_2auth=secret)
            user.has_2auth = True
            user.save()

            return JsonResponse({'status': True})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
@jwt_token_required
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
            return JsonResponse({'error': 'User not found'}, status=404)
        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@jwt_token_required
def get_qrcode(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        pseudo = data.get('pseudo')
        secret = data.get('secret')

        image_content = qrcode_generator(pseudo, secret)
        buffer = base64.b64decode(image_content)

        response = HttpResponse(buffer, content_type="image/png")
        response['Content-Disposition'] = f'inline; filename="qrcode.png"'
        return response
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


################################################### TOKEN JWT ###########################################
@csrf_exempt
def get_jwt_token(request, id):
    if request.method == 'POST':
        try:
            user = User.objects.get(id=id)
            if user.token_jwt:
                return JsonResponse({'jwt_token': user.token_jwt})
            else:
                return JsonResponse({'error': 'no jwt token'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def get_jwt_tokenCookies(request, id):
    if request.method == 'POST':
        try:
            user = User.objects.get(id=id)
            if user.token_jwt:
                response = JsonResponse({'jwt_token': user.token_jwt})
                
                response.set_cookie('jwt', user.token_jwt, httponly=True)
                #cookies.set('jwt', jwt, { path: '/', httpOnly: true, sameSite: 'None', secure: true });
                
                return response
            else:
                return JsonResponse({'error': 'no jwt token'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

