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
from .models import User, GamePong, GameTTT, Tournament, Avatar
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .decorators import jwt_token_required, refresh_token_required, oauth2_token_required
from datetime import datetime, date
from .utils import usernameAlreadyUse, pseudoAlreadyUse


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
            'username': user.username,
            'pseudo': user.pseudo,
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
####################################################  CHECK ALIAS ###############################################

@csrf_exempt
def checkalias(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
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
        creator_t = data.get('creator')
        playersUsers = data.get('playersUser')
        playersAlias = data.get('playersAlias')

        try:
            trnmt = Tournament.objects.create(
                creator = User.objects.get(username=creator_t),
                title = f'{creator_t}\'s tournament',
                list_player_user = ','.join([username for username in playersUsers]),
                list_player_other = ','.join([alias for alias in playersAlias]),
             ) 
            trnmt.save()
            for guest in playersAlias:
                try:
                    User.objects.get(aliasname=guest)
                except User.DoesNotExist:
                    user_tmp = User.objects.create(
                        aliasname = guest,
                        username='',
                        pseudo='',
                    )
                    user_tmp.save()
        except :
            return JsonResponse({'error': 'Error happened when prepared Tournament.'}, status=400)
        return JsonResponse({
            'tournamentID': trnmt.id
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
        winnerG = data.get('winnerN')
        tournament = Tournament.objects.get(id=tournamentID)
        try:
            p1 = User.objects.get(username=player1)
        except User.DoesNotExist:
            p1 = User.objects.get(aliasname=player1)

        try:
            p2 = User.objects.get(username=player2)
        except User.DoesNotExist:
            p2 = User.objects.get(aliasname=player2)

        loserG = p1
        wG = p2
        if player1 == winnerG:
            loserG = p2
            wG = p1

        gp = GamePong(
            score = "1-0",
            winner = wG,
            loser = loserG,
            tournament = tournament,
            date = datetime.now().strftime("%d/%m/%Y %H:%M"),
        )
        gp.save()
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
        winnerG = data.get('winnerN')
        try:
            t = Tournament.objects.get(id=tournamentID)
            try:
                u = User.objects.get(username=winnerG)
            except User.DoesNotExist:
                u = User.objects.get(aliasname=winnerG)
            t.winner_t = u
            t.save()
        except Tournament.DoesNotExist:
            return (JsonResponse({'error', 'Tournament does not exist.'}, status=400))
        return JsonResponse({
            'tournamentID': tournamentID
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def ttthistory(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player1 = data.get('p1')
        player2 = data.get('p2')

        p2State = data.get('p2State')
        gameState = data.get('gameState')
        winnerG = data.get('winningPlayer')
        p1 = User.objects.get(username=player1)
        if (p2State == 'Alias' or p2State == 'IA'):
            try:
                p2 = User.objects.get(aliasname=player2)
            except User.DoesNotExist:
                p2 = User.objects.create(
                    aliasname=player2,
                    username='',
                    pseudo='',
                )
        else:
            p2 = User.objects.get(username=player2)

        w = p2
        l = p1
        if gameState != "draw" and player1 == winnerG:
            w = p1
            l = p2
        gt = GameTTT.objects.create(
            is_draw = True if gameState == "draw" else False,
            draw_user1 = p1 if gameState == "draw" else None,
            draw_user2 = p2 if gameState == "draw" else None,
            winner = w if gameState != "draw" else None,
            loser = l if gameState != "draw" else None,
            date = datetime.now().strftime("%d/%m/%Y %H:%M"),
        )
        gt.save()
        return (JsonResponse({
            'player1', player1
        }))
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
        winnerG = data.get('winnerN')

        p1 = User.objects.get(username=player1)
        if (p2State == 'Alias' or p2State == 'IA'):
            try:
                p2 = User.objects.get(aliasname=player2)
            except User.DoesNotExist:
                p2 = User.objects.create(
                    aliasname=player2,
                    username='',
                    pseudo='',
                )
        else:
            p2 = User.objects.get(username=player2)
        p2.save()
        w = p2
        l = p1
        if player1 == winnerG:
            w = p1
            l = p2

        res = f"{p1score}-{p2score}"
        if p1score<p2score:
            res = f"{p2score}-{p1score}"

        gp = GamePong(
            score = res,
            winner = w,
            loser = l,
            date = datetime.now().strftime("%d/%m/%Y %H:%M"),
        )
        gp.save()
        return JsonResponse({
            # 'message': f'Game has been saved. GG to {w.username if w.username != '' else w.aliasname}',
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

        p1 = User.objects.get(username=player1)
        if (p2state == 'Alias'):
            try:
                p2 = User.objects.get(aliasname=player2)
            except User.DoesNotExist:
                p2 = User.objects.create(
                    aliasname=player2,
                    username='',
                    pseudo='',
                )
        else:
            p2 = User.objects.get(username=player2)
        if (p3state == 'Alias'):
            try:
                p3 = User.objects.get(aliasname=player2)
            except User.DoesNotExist:
                p3 = User.objects.create(
                    aliasname=player3,
                    username='',
                    pseudo='',
                )
        else:
            p3 = User.objects.get(username=player3)
        p2.save()
        p3.save()
        tab = [p1score, p2score, p3score]
        tab = tab.sort(reverse=True)

        w = p3
        l = 'p3'
        if player1 == winner:
            w = p1
            l = 'p1'
        elif player2 == winner:
            w = p2
            l = 'p2'

        if l == 'p1':
            l1 = p3
            l2 = p2
            if p2score > p3score:
                l1 = p2
                l2 = p3
        elif l == 'p2':
            l1 = p3
            l2 = p1
            if p1score > p3score:
                l1 = p1
                l2 = p3
        elif l == 'p3':
            l1 = p2
            l2 = p1
            if p1score > p2score:
                l1 = p1
                l2 = p2

        gp = GamePong.objects.create(
            score = f"{tab[0]}-{tab[1]}-{tab[2]}",
            winner = w,
            loser = l1,
            loser1 = l2,
            date = datetime.now().strftime("%d/%m/%Y %H:%M"),
        )
        gp.save()
        return JsonResponse({
            'player1': player1
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


################################################### TTTHISTORY #############################################

# @csrf_exempt
# def ttthistory(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         lost = data.get('loser')
#         won = data.get('winningPlayer')
#         return JsonResponse({
#             'lost' : lost
#         })
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)