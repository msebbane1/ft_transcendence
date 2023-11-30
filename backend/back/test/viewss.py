# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
#from oauth2_provider.models import get_access_token_model
from oauth2_provider.models import get_application_model, AccessToken
from requests import post
#from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
#from rest_framework.renderers import JSONRenderer

Application = get_application_model()

def generate_42_auth_url(request):
    print('La vue generate_42_auth est appelée!')
    redirect_uri = settings.LOGIN_REDIRECT_URL
    authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={settings.SOCIAL_AUTH_42_KEY}&redirect_uri={redirect_uri}&response_type=code'
    return JsonResponse({'authorization_url': authorization_url})

@api_view(['POST'])
def exchange_code_for_token(request):
    try:
        # Récupérer le code d'autorisation du corps de la requête
        authorization_code = request.POST.get('code')
        print('Code d\'autorisation :', authorization_code)

        # Échanger le code contre le jeton d'accès
        token_url = 'https://api.intra.42.fr/oauth/token'
        token_data = {
            'client_id': settings.SOCIAL_AUTH_42_KEY,
            'client_secret': settings.SOCIAL_AUTH_42_SECRET,
            'code': authorization_code,
            'redirect_uri': settings.LOGIN_REDIRECT_URL,
            'grant_type': 'authorization_code',
        }
        
        response = post(token_url, data=token_data)
        response_data = response.json()

        # Vérifier si l'échange du code a réussi
        if 'access_token' not in response_data:
            raise Exception('Échange du code contre le jeton d\'accès a échoué')

        # Obtenir l'application associée à votre client_id
        application = Application.objects.get(client_id=settings.SOCIAL_AUTH_42_KEY)

        # Créer un nouvel objet AccessToken associé à l'application avec oauth2_provider
        access_token = AccessToken.objects.create(
            user=application.user,
            application=application,
            token=response_data['access_token'],
            expires=application.get_expires(),
            scope=response_data.get('scope', ''),
        )


        # Récupérer l'utilisateur associé au jeton d'accès
        user = access_token.user

        # Authentifier l'utilisateur pour générer un token JWT
        auth_user = authenticate(request, username=user.username)
        login(request, auth_user)

        # Générer un token d'accès JWT
       # refresh = RefreshToken.for_user(auth_user)
        #access_token = str(refresh.access_token)
        #print('TOKEN :', access_token)

        # Retourner le jeton d'accès
        response = JsonResponse({'authenticated': True, 'access_token': access_token.token})
        response['Access-Control-Allow-Origin'] = '*'
        return response

    except Exception as e:
        print(f"Erreur lors de l'échange du code contre le jeton d'accès : {e}")
        return JsonResponse({'authenticated': False}, status=400)


#@api_view(['GET'])
#def check_42_auth(request):
#    print('La vue check_42_auth est appelée!')
 #   user = request.user

    # Vérifiez si l'utilisateur est authentifié avec 42
  #  if user.is_authenticated:
   #     try:
            # Vérifiez si l'utilisateur a une authentification sociale 42
    #        user_42_social_auth = user.social_auth.get(provider='42')

            # Authentifiez l'utilisateur pour générer un token JWT
   #         auth_user = authenticate(request, username=user.username)
   #         login(request, auth_user)

            # Générez un token d'accès JWT
    #        refresh = RefreshToken.for_user(auth_user)
     #       access_token = str(refresh.access_token)
      #      print('Token d\'accès généré:', access_token)

            # Retournez le jeton d'accès
     #       return Response({'authenticated': True, 'access_token': access_token})
      #  except UserSocialAuth.DoesNotExist:
       #     pass

    #return Response({'authenticated': False})

