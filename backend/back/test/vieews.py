import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests
from asgiref.sync import async_to_sync

@method_decorator(csrf_exempt, name='dispatch')
class Callback42View(View):
    @async_to_sync
    async def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            code = data.get('code')
            uid = 'u-s4t2ud-ab0a2c4d071ad2ab41a09ecc31c56a394d7d0ffe63be47f4cd76e20ae87e843e'
            secret = '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'
            redirect_uri = 'http://localhost:3000/callback'

            token_url = 'https://api.intra.42.fr/oauth/token'
            headers = {'Content-Type': 'application/json'}
            body = json.dumps({
                'grant_type': 'authorization_code',
                'client_id': uid,
                'client_secret': secret,
                'code': code,
                'redirect_uri': redirect_uri
            })

            response = await self.fetch_token(token_url, headers, body)

            # Votre logique de traitement de la réponse ici

            return JsonResponse(response)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=401)

    async def fetch_token(self, url, headers, body):
        async with requests.post(url, headers=headers, data=body) as response:
            return await response.json()

    async def get(self, request, *args, **kwargs):
        return JsonResponse({'message': 'GET RECEIVED'})

