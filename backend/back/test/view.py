from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from django.contrib.auth import authenticate, login
from django.conf import settings

@csrf_exempt
@require_POST
class Callback42View(View):


    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

   # def get(self, request):
    #    redirect_uri = 'http://localhost:3000/callback'
     #   authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={settings.SOCIAL_AUTH_42_KEY}&redirect_uri={redirect_uri}&response_type=code'
       # data = json.loads(request.body)
      #  code = data.get('code')

      #  if code:
      #      return JsonResponse({'code': code})
       # else:
        #    return JsonResponse({'code': code})
      #  return JsonResponse({'authorization_url': authorization_url})

    def post(self, request):
        data = json.loads(request.body)
        code = data.get('code')

        if code:
            return JsonResponse({'code': code})
        else:
            return JsonResponse({'code': code})

        token_url = 'https://api.intra.42.fr/oauth/token/'
        response = requests.post(
            token_url,
            params={
                'client_id': 'u-s4t2ud-ab0a2c4d071ad2ab41a09ecc31c56a394d7d0ffe63be47f4cd76e20ae87e843e',
                'client_secret': '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',
                'code': code,
                'redirect_uri': 'http://localhost:3000/callback',
                'grant_type': 'authorization_code',
            }
        )

        if response.status_code == 200:
            access_token = response.json().get('access_token')

            response_data = response.json()
            print('Token Response:', response_data)

            if 'access_token' not in response_data:
                return JsonResponse({'error': 'Authentication failed TOKEN', 'response': response_data})

            user_info_url = 'https://api.intra.42.fr/v2/me'
            headers = {'Authorization': f'Bearer {response_data["access_token"]}'}
            user_info_response = post(user_info_url, headers=headers)
            user_info = user_info_response.json()

            user, created = User.objects.get_or_create(username=user_info['login'])
            user.set_unusable_password()
            user.save()

            user = authenticate(request, username=user_info['login'])
            login(request, user)

            return JsonResponse({'authenticated': True, 'access_token': access_token})
        else:
            return JsonResponse({'error': 'Failed to obtain access token'}, status=response.status_code)

