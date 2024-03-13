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
@jwt_token_required
def add_friend(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username_who_request = data.get('username')
        friend_to_add = data.get('user_to_add')

        if (username_who_request == friend_to_add):
            return (JsonResponse({'error': 'It really takes a bean to add yourself... anyway...'}, status=200))

        try:
            user = User.objects.get(username=username_who_request)
            user_to_add = User.objects.get(username=friend_to_add)
            if (user.friends.filter(pk=user_to_add.pk).exists()):
                return (JsonResponse({'error': 'User already in your friend list.'}, status=200))
            user.follow(user_to_add)
            user.save()
        except User.DoesNotExist:
            return (JsonResponse({'error': 'User doesn\'t exist.'}, status=200))
        return (JsonResponse({'message':f'User {user_to_add.username}  added to your friend list'}, status=200))

@csrf_exempt
@jwt_token_required
def del_friend(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username_who_request = data.get('username')
        friend_to_del = data.get('user_to_del')

        if (username_who_request == friend_to_del):
            return (JsonResponse({'error': 'It really takes a bean to suppress yourself... anyway...'}, status=200))

        try:
            user = User.objects.get(username=username_who_request)
            user_to_del = User.objects.get(username=friend_to_del)
            if (not user.friends.filter(pk=user_to_del.pk).exists()):
                return (JsonResponse({'error': 'The user is not in your friend list.'}, status=200))
            user.unfollow(user_to_del)
            user.save()
        except User.DoesNotExist:
            return (JsonResponse({'error': 'User doesn\'t exist.'}, status=200))
        return (JsonResponse({'message':f'User {user_to_del.username} removed from your friend list'}, status=200))


@csrf_exempt
def get_following(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        u = data.get('id')
        try:
            user = User.objects.get(id=u)
        except User.DoesNotExist:
            return (JsonResponse({'error': 'User doesn\'t exist.'}, status=200))
        
        now_date = datetime.strptime(datetime.now().strftime("%H:%M"), "%H:%M")
        friends = user.getFollowing()
        lst_f = []
        for f in friends:
            dt_tmp = datetime.strptime(f.limit_status, "%H:%M")
            diff = ((now_date - dt_tmp).seconds // 60) % 60
            if (diff >= 5):
                f.status = "offline"
                f.save()
            lst_f.append({'friend': f"{f.username}", 'id': f"{f.id}", 'status': f"{f.status}"})
        return (JsonResponse({'message': lst_f}, status=200))

@csrf_exempt
def get_user_infos(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        id = data.get('id')
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User doesn\'t exist.'}, status=200)
        
        avatar_id = None
        if user.avatar:
            avatar_id = user.avatar.id
        
        user_info = {
            'username': user.username,
            'pseudo': user.pseudo,
            'status': user.status,
            'id': user.id,
            'avatar_id': avatar_id,
        }
        
        return JsonResponse({'message': user_info}, status=200)



################### STATS JOUEUR ##################

@csrf_exempt
def stats_games(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        u = data.get('id')

        try:
            user = User.objects.get(id=u)
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
            if wr_ttt == '0':
                wrCheck = 0
            else:
                wrCheck = wr_ttt
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
                'draw_ttt': nb_draw_ttt,
                'wrCheck': wrCheck
            }
        ))

@csrf_exempt
def stats_gamesttt(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        u = data.get('username')
        try:
            user = User.objects.get(pseudo=u)
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
            if wr_ttt == '0':
                wrCheck = 0
            else:
                wrCheck = wr_ttt
        except User.DoesNotExist:
            return (JsonResponse({'error': 'L\'utilisateur n\'existe pas.'}, status=400))
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
                'draw_ttt': nb_draw_ttt,
                'wrCheck': wrCheck
            }
        ))

@csrf_exempt
def list_games(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        u = data.get('id')

        try:
            user = User.objects.get(id=u)
            list_games = []
            tmp = user.winnerpong.all().union(user.loserpong.all(), user.loserpong2.all() )
            for g in tmp:
                list_games.append(
                    {
                        'type_game': 'PONG',
                        'winner': g.winner.username if g.winner.username != '' else g.winner.aliasname,
                        'loser': g.loser.username if g.loser.username != '' else g.loser.aliasname,
                        'loser2': g.loser2.username if g.loser2 and g.loser2.username != '' else g.loser2.aliasname if g.loser2 else '',
                        'date': g.date,
                        'score': g.score,
                        'tournament': f'{g.tournament.creator.username}\'s tournament' if g.tournament else '', 
                    })
            tmp = user.winnerttt.all().union(user.loserttt.all())
            for g in tmp:
                list_games.append(
                    {
                        'type_game': 'TICTACTOES',
                        'winner': g.winner.username if g.winner.username != '' else g.winner.aliasname,
                        'loser': g.loser.username if g.loser.username != '' else g.loser.aliasname,
                        'date': g.date,
                    })
            tmp = user.draw_user1.all().union(user.draw_user2.all())
            for g in tmp:
                list_games.append(
                    {
                        'type_game': 'TICTACTOES',
                        'draw_user1': g.draw_user1.username if g.draw_user1.username != '' else g.draw_user1.aliasname,
                        'draw_user2': g.draw_user2.username if g.draw_user2.username != '' else g.draw_user2.aliasname,
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
        host = data.get('host')
        try:
            host = User.objects.get(pseudo=host)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)
        try:
            user = User.objects.get(pseudo=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)
        if not user.password_tournament:
            return JsonResponse({'error': 'You didnt set your tournament password yet'}, status=400)
        if not check_password(password, user.password_tournament):
            return JsonResponse({'error': 'Invalid password'}, status=400)

        tmp = User.objects.get(pseudo=username)
        tmp.status = "online"
        tmp.limit_status = datetime.now().strftime("%H:%M")
        tmp.save()
        # host.status = 'In game'
        # host.save()
        # user.status = "In game"
        # user.save()
        return JsonResponse({
            'username': user.username,
            'pseudo': user.pseudo,
        })
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

####################################################  SIGNINTOURNAMENT2 ###############################################

@csrf_exempt
def signintournament2(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        host = data.get('host')
        try:
            host = User.objects.get(pseudo=host)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)
        try:
            user = User.objects.get(pseudo=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)
        if not user.password_tournament:
            return JsonResponse({'error': 'You didnt set your tournament password yet'}, status=400)
        if not check_password(password, user.password_tournament):
            return JsonResponse({'error': 'Invalid password'}, status=400)
        # host.status = 'In game'
        # host.save()
        # user.status = "In game"
        # user.save()
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

        for p in playersUsers:
            tmp = User.objects.get(username=p)
            tmp.status = "online"
            tmp.limit_status = datetime.now().strftime("%H:%M")
            tmp.save()

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
def leaveStatus(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        lst_players = data.get('toSet')
        host = data.get('host')
        for p in lst_players:
            if p == host:
                tmp = User.objects.get(pseudo=p)
                tmp.status = "online"
                tmp.save()
            else:
                tmp = User.objects.get(pseudo=p)
                tmp.status = "offline"
                tmp.save()
        return JsonResponse({'message': 'test'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def leaveStatus2(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        lst_players = data.get('toSet')
        host = data.get('host')
        for p in lst_players:
            if p == host:
                tmp = User.objects.get(pseudo=p)
                tmp.status = "online"
                tmp.save()
            else:
                tmp = User.objects.get(pseudo=p)
                tmp.status = "offline"
                tmp.save()
        return JsonResponse({'message': 'test'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def endtournament(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        lst_players = data.get('playersUser')
        tournamentID = data.get('tournamentID')
        winnerG = data.get('winnerN')
        host = data.get('host')
        lst_players.pop(0)
        try:
            host = User.objects.get(username=host)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=400)
        try:
            t = Tournament.objects.get(id=tournamentID)
            t.creator.limit_status = datetime.now().strftime("%H:%M")
            t.creator.list_players_status = lst_players
            for p in lst_players:
                tmp = User.objects.get(username=p)
                tmp.status = "online"
                tmp.limit_status = datetime.now().strftime("%H:%M")
                tmp.save()
            try:
                u = User.objects.get(username=winnerG)
            except User.DoesNotExist:
                u = User.objects.get(aliasname=winnerG)
            t.winner_t = u
            t.save()
        except Tournament.DoesNotExist:
            return (JsonResponse({'error', 'Tournament does not exist.'}, status=400))
        # host.status = 'online'
        # host.save()
        return JsonResponse({
            'lst_players': lst_players
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
        p1 = User.objects.get(pseudo=player1)
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
            p2 = User.objects.get(pseudo=player2)

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
        p1.limit_status = datetime.now().strftime("%H:%M")
        p1.status = "online"
        p1.save()
        p2.limit_status = datetime.now().strftime("%H:%M")
        p2.status = "online"
        gt.save()
        return JsonResponse({'player1': player1})
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
                p2.save()
        else:
            p2 = User.objects.get(username=player2)

        p1.limit_status = datetime.now().strftime("%H:%M")
        p1.status = 'online'
        p1.save()
        p2.limit_status = datetime.now().strftime("%H:%M")
        p2.status = 'online'
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
                p2.save()
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
                p3.save()
        else:
            p3 = User.objects.get(username=player3)

        p1.limit_status = datetime.now().strftime("%H:%M")
        p1.status = 'online'
        p1.save()
        p2.limit_status = datetime.now().strftime("%H:%M")
        p2.status = 'online'
        p2.save()
        p3.limit_status = datetime.now().strftime("%H:%M")
        p3.status = 'online'
        p3.save()

        tab = [p1score, p2score, p3score]
        tab.sort(reverse=True)

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
            loser2 = l2,
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