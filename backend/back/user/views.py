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

            return JsonResponse({'message': 'Username updated with success !'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    return JsonResponse({'error': 'Unauthorized method'}, status=405)



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

            return JsonResponse({'message': 'Turnament password updated with success!'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
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
            return JsonResponse({'message': 'No image, default image'}, status=200)

    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

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
