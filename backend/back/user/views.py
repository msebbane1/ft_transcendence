from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from requests import post
from django.conf import settings
import json
from json.decoder import JSONDecodeError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.http import require_POST
import requests
import os
from django.http import HttpResponse
from back.models import User, Avatar
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from back.decorators import jwt_token_required, refresh_token_required, oauth2_token_required
from datetime import datetime, date
from back.utils import usernameAlreadyUse, pseudoAlreadyUse

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

        #if not new_username:
        #    return JsonResponse({'error': 'Veuillez entrer un nom d\'utilisateur'}, status=400)
        # if len(new_username) < 5:
        #     return JsonResponse({'error': 'Le nom d\'utilisateur doit contenir au moins 5 caractères'}, status=400)
        # if len(new_username) > 10:
        #     return JsonResponse({'error': 'Le nom d\'utilisateur doit contenir au maximum 10 caractères'}, status=400)
        # if not new_username.isalpha():
        #     return JsonResponse({'error': 'Le nom d\'utilisateur ne peut contenir que des lettres'}, status=400)
        # if (usernameAlreadyUse(new_username)):
        #     return (JsonResponse({'error': 'Le nom d\'utilisateur est déjà utliser, veuillez en choisir un autre...'}, status=400))
        # if (pseudoAlreadyUse(new_username)):
        #     return (JsonResponse({'error': 'Le nom d\'utilisateur est déjà utliser, veuillez en choisir un autre...'}, status=400))

        if not new_username:
            return JsonResponse({'empty': False})
        if len(new_username) < 5:
            return JsonResponse({'lenmin': False})
        if len(new_username) > 10:
            return JsonResponse({'lenmax': False})
        if not new_username.isalpha():
            return JsonResponse({'alpha': False})
        if (usernameAlreadyUse(new_username)) or (pseudoAlreadyUse(new_username)):
            return (JsonResponse({'nameAlreadyUse': False}))
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

        if not new_password:
            return JsonResponse({'empty': False})
        if len(new_password) < 5:
            return JsonResponse({'lenmin': False})
        if len(new_password) > 10:
            return JsonResponse({'lenmax': False})
        if new_password != repeat_new_password:
            return JsonResponse({'repeat': False})
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
            return JsonResponse({'noimage': False})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)




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


