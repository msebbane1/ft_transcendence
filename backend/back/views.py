from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, csrf_protect
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
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from .hash_password import hash_password
import hashlib
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from .generate_jwt_token import generate_jwt_token
import jwt
from .decorators import jwt_token_required, refresh_token_required, oauth2_token_required
from django.contrib.auth import authenticate, login
from datetime import datetime, date

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
    
    return JsonResponse({'error': 'Methode non autorisée'}, status=405)
    

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
            return JsonResponse({'error': 'Image de profil indisponible'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#### INFOS USER ####
## A changer en get ??
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
            return JsonResponse({'error': 'Infos user indisponible'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

########################################################### ALL DATA USER 42 #################################################################33
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
            #jwt_token = str(refresh.access_token)
            user.status = "online"
            user.register = False
            user.token_jwt = generate_jwt_token(user)
            user.save()
            #jwt_token = generate_jwt_token(user)

            return JsonResponse({
                'id': user.id,
                'username': user.username,
                'pseudo': user.pseudo,
                '2FA_secret': user.secret_2auth,
                '2FA_valid': False,
                'avatar_update': user.avatar.avatar_update,
                'status_2FA': user.has_2auth,
                'access_token': access_token,
                'refresh_token': str(refresh),
                'avatar_id': user.avatar.id,
                'status': user.status,
                #'jwt_token': user.token_jwt
})

        except json.decoder.JSONDecodeError as e:
            return JsonResponse({'error': 'Reponse JSON et access_token indisponible'}, status=500)

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

        
        existing_users = User.objects.filter(pseudo=username) #reprendre fonction // ou username
        existing_username = User.objects.filter(username=username)
        if existing_username.exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        if existing_users.exists():
            return JsonResponse({'error': 'L\'utilisateur existe déja, veuillez en choisir un autre'}, status=400)
        if len(username) < 5:
            return JsonResponse({'error': 'Le nom d\'utilisateur doit contenir au moins 5 caractères'}, status=400)
        if len(username) > 10:
            return JsonResponse({'error': 'Le nom d\'utilisateur doit contenir au maximum 10 caractères'}, status=400)
        if len(password) < 5:
            return JsonResponse({'error': 'Le mot de passe doit contenir au moins 5 caractères'}, status=400)
        if password != repeat_password:
            return JsonResponse({'error': 'Le mot de passe ne correspond pas'}, status=400)

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
            return JsonResponse({'error': 'L\'utilisateur n\'existe pas'}, status=400)

        if not user.password:
                return JsonResponse({'error': 'Connexion non autorisée, Veuillez vous connecter via 42'}, status=400)
        elif not check_password(password, user.password):
            return JsonResponse({'error': 'Mot de passe invalide'}, status=400)
        
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
            '2FA_secret': user.secret_2auth,
            '2FA_valid': False,
            'status_2FA': user.has_2auth,
            'avatar_id': user.avatar.id,
            'avatar_update': user.avatar.avatar_update,
            'status': user.status,
            #'jwt_token': user.token_jwt,
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

##################################################### TWO FACTOR AUTH ###########################################

@csrf_exempt
def signout(request, id):
    if request.method == 'POST':
        #logout(request)

        try:
            user = User.objects.get(id=id)
            user.status = "offline"
            user.save()

            return JsonResponse({'success': 'Déconnexion réussie'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

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
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

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
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)



@csrf_exempt
@jwt_token_required
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
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@jwt_token_required
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

def pseudoAlreadyUse(new_username):
    try:
        user_count = User.objects.filter(pseudo=new_username).count()
        return user_count > 0
    except User.DoesNotExist:
        return False

######################################################## UPDATE USERNAME ############################################

@csrf_exempt
@jwt_token_required
#@refresh_token_required
#@api_view(['GET', 'POST'])
#@authentication_classes([JWTAuthentication])
#@login_required
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
        if (pseudoAlreadyUse(new_username)):
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
@jwt_token_required
def create_password_tournament(request, id):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_password = data.get('new_password')
        repeat_new_password = data.get('repeatPassword')


        if new_password != repeat_new_password:
            return JsonResponse({'error': 'Le mot de passe ne correspond pas'}, status=400)
        try:
            user = User.objects.get(id=id)
            user.password_tournament = make_password(new_password)
            if user.register:
                user.password = make_password(new_password)
            user.save()

            return JsonResponse({'message': 'Le mot de passe Tournois mis à jour avec succès'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
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


def get_avatar(request, id, avatar_id):
    
    try:
        user = User.objects.get(id=id)
        avatar = get_object_or_404(Avatar, id=avatar_id)

        if avatar.avatar_update == False and user.register == False:
            image_url42 = avatar.image_url_42
            return JsonResponse({'image_url': image_url42})

        elif avatar.avatar_update == True:
            image_url = request.build_absolute_uri(avatar.image.url)
            return JsonResponse({'image_url': image_url})
        else:
            return JsonResponse({'message': 'Aucune image, image par default'}, status=200)

    except User.DoesNotExist:
        return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)

@csrf_exempt
@jwt_token_required
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


################################## 2FA EMAIL##################

@csrf_exempt
def send_verification_code(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if email:
            
            verification_code = get_random_string(length=6, allowed_chars='0123456789')

            
            send_mail(
                'Code de vérification',
                f'Votre code de vérification est : {verification_code}',
                'from@example.com',
                [email],
                fail_silently=False,
            )
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Veuillez fournir une adresse e-mail.'})


############################ FRIENDS ###########################
@csrf_exempt
def add_friend(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username_who_request = data.get('username')
        friend_to_add = data.get('user_to_add')

        if (username_who_request == friend_to_add):
            return (JsonResponse({'error': 'Faut vraiment un grain pour s\'ajouter soi-même... fin bref...'}, status=200))

        try:
            user = User.objects.get(username=username_who_request)
            user_to_add = User.objects.get(username=friend_to_add)
            if (user.friends.filter(pk=user_to_add.pk).exists()):
                return (JsonResponse({'error': 'L\'utilisateur est déjà dans votre liste d\'ami.'}, status=200))
            user.follow(user_to_add)
            user.save()
        except User.DoesNotExist:
            return (JsonResponse({'error': 'L\'utilisateur n\'existe pas.'}, status=200))
        return (JsonResponse({'message':f'L\'ami(e) {user_to_add.username} a été ajoute aux amis'}, status=200))

@csrf_exempt
def del_friend(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username_who_request = data.get('username')
        friend_to_del = data.get('user_to_del')

        if (username_who_request == friend_to_del):
            return (JsonResponse({'error': 'Faut vraiment un grain pour se supprimer soi-même... fin bref...'}, status=200))

        try:
            user = User.objects.get(username=username_who_request)
            user_to_del = User.objects.get(username=friend_to_del)
            if (not user.friends.filter(pk=user_to_del.pk).exists()):
                return (JsonResponse({'error': 'L\'utilisateur n\'est pas dans votre liste d\'ami.'}, status=200))
            user.unfollow(user_to_del)
            user.save()
        except User.DoesNotExist:
            return (JsonResponse({'error': 'L\'utilisateur n\'existe pas.'}, status=200))
        return (JsonResponse({'message':f'L\'ami(e) {user_to_del.username} a été supprimé des amis'}, status=200))

@csrf_exempt
def get_following(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        u = data.get('username')
        try:
            user = User.objects.get(username=u)

        except User.DoesNotExist:
            return (JsonResponse({'error': 'L\'utilisateur n\'existe pas.'}, status=200))
        friends = user.getFollowing()
        lst_f = []
        for f in friends:
            lst_f.append(f.username)
        return (JsonResponse({'message': ','.join(lst_f)}, status=200))

################### STATS JOUEUR ##################

@csrf_exempt
def stats_games(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        u = data.get('username')
        
        try:
            user = User.objects.get(username=u)
            nb_win_tot = user.getCountWinsPong() + user.getCountWinsTTT()
            nb_lose_tot = user.getCountLosesPong() + user.getCountLosesTTT()
            nb_win_pong = user.getCountWinsPong()
            nb_lose_pong = user.getCountLosesPong()
            nb_win_ttt = user.getCountWinsTTT()
            nb_lose_ttt = user.getCountLosesTTT()
            nb_draw_ttt = user.getCountDrawTTT()
            if (nb_win_pong + nb_lose_pong == 0):
                wr_pong = '0'
            else:
                wr_pong = (nb_win_pong / (nb_win_pong + nb_lose_pong)) * 100
            if (nb_win_ttt + nb_lose_ttt == 0):
                wr_ttt = '0'
            else:
                wr_ttt = (nb_win_ttt / (nb_win_ttt + nb_lose_ttt + nb_draw_ttt)) * 100
            if (nb_win_tot + nb_lose_tot == 0):
                wr_tot = '0'
            else:
                wr_tot = (nb_win_tot / (nb_win_tot + nb_lose_tot)) * 100
        except User.DoesNotExist:
            return (JsonResponse({'error': 'L\'utilisateur n\'existe pas.'}, status=200))
        
        return (JsonResponse(
            {
                'total_win': nb_win_tot,
                'total_lose': nb_lose_tot,
                'pong_win': nb_win_pong,
                'pong_lose': nb_lose_pong,
                'ttt_win': nb_win_ttt,
                'ttt_lose': nb_lose_ttt,
                'tot_wr': str(wr_tot)[:5],
                'pong_wr': str(wr_pong)[:5],
                'ttt_wr': str(wr_ttt)[:5],
                'draw_ttt': nb_draw_ttt
            }
        ))

@csrf_exempt
def list_games(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        u = data.get('username')

        try:
            user = User.objects.get(username=u)
            list_games = []
            tmp = user.winnerpong.all().union(user.loserpong.all(), user.loserpong2.all() )
            for g in tmp:
                list_games.append(
                    {
                        'type_game': 'PONG',
                        'winner': g.winner.username,
                        'loser': g.loser.username,
                        'loser2': g.loser2.username if g.loser2 else '',
                        'date': g.date,
                        'score': g.score,
                        'tournament': f'{g.tournament.creator}\'s tournament' if g.tournament else '', 
                    })
            tmp = user.winnerttt.all().union(user.loserttt.all())
            for g in tmp:
                list_games.append(
                    {
                        'type_game': 'TICTACTOES',
                        'winner': g.winner.username,
                        'loser': g.loser.username,
                        'date': g.date,
                    })
            tmp = user.draw_user1.all().union(user.draw_user2.all())
            for g in tmp:
                list_games.append(
                    {
                        'type_game': 'TICTACTOES',
                        'draw_user1': g.draw_user1.username,
                        'draw_user2': g.draw_user2.username,
                        'date': g.date,
                    }
                )
            lst = sorted(list_games, key=lambda x: datetime.strptime(x['date'], '%d/%m/%Y %H:%M'), reverse=True)
        except User.DoesNotExist:
            return (JsonResponse({'error': 'L\'utilisateur n\'existe pas.'}, status=200))

        return (JsonResponse(
                {
                    'list_object': lst
                }
            ))


#################################################### SIGNINTOURNAMENT ####################################
@csrf_exempt
def signintournament(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        try:
            user = User.objects.get(pseudo=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)
        if not user.password_tournament:
            return JsonResponse({'error': 'You didnt set your tournament password yet'}, status=400)
        if not check_password(password, user.password_tournament):
            return JsonResponse({'error': 'Invalid password'}, status=400)
        user.status = "online"
        user.save()
        return JsonResponse({
            'id': user.id,
            'register': user.register,
            'username': user.username,
            'pseudo': user.pseudo,
            '2FA_secret': user.secret_2auth,
            '2FA_valid': False,
            'status_2FA': user.has_2auth,
            'wins': user.wins,
            'avatar_id': user.avatar.id,
            'avatar_update': user.avatar.avatar_update,
            'status': user.status,
            'loses': user.loses
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
####################################################  CHECK ALIAS ###############################################

@csrf_exempt
def checkalias(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        # userExist = User.objects.get(username=username)
        # if(userExist)
        #     return JsonResponse({'error': 'Someone already\'s using this Pseudo'}, status=400)
        if len(username) < 5:
            return JsonResponse({'error': 'The alias must contain at least 5 characters'}, status=400)
        if len(username) > 10:
            return JsonResponse({'error': 'The alias must contain at most 10 characters'}, status=400)
        if not username.isalpha():
            return JsonResponse({'error': 'The alias can only contain alpha characters'}, status=400)
        return JsonResponse({
            'username': username
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def begintournament(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        playersUsers = data.get('playersUser')
        playersAlias = data.get('playersAlias')
        tournamentID = 1
        return JsonResponse({
            'tournamentID': tournamentID
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def updatetournament(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        tournamentID = data.get('tournamentID')
        player1 = data.get('p1')
        player2 = data.get('p2')
        winner = data.get('winnerN')
        return JsonResponse({
            'tournamentID': tournamentID
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def endtournament(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        tournamentID = data.get('tournamentID')
        Winner = data.get('winnerN')
        return JsonResponse({
            'tournamentID': tournamentID
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def pong2phistory(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player1 = data.get('p1')
        player2 = data.get('p2')
        p1score = data.get('p1score')
        p2score = data.get('p2score')
        p2State = data.get('p2State')
        winner = data.get('winnerN')
        return JsonResponse({
            'player1': player1
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def pong3phistory(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player1 = data.get('p1')
        player2 = data.get('p2')
        player3 = data.get('p3')
        p1score = data.get('p1score')
        p2score = data.get('p2score')
        p3score = data.get('p3score')
        p2state = data.get('p2state')
        p3state = data.get('p3state')
        winner = data.get('winnerN')
        return JsonResponse({
            'player1': player1
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

################### STATS JOUEUR ##################

# @csrf_exempt
# def winrate(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         u = data.get('username')
