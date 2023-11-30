import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import requests

@csrf_exempt
@require_POST
def Callback42View(request):
    try:
        # Récupérer les données JSON de la requête
        data = json.loads(request.body.decode('utf-8'))

        code = data.get('code')

        # Vérifier que tous les paramètres nécessaires sont présents
        if not (uid and secret and code and redirect_uri):
            raise ValueError("Tous les paramètres nécessaires ne sont pas fournis.")
        
        # Effectuer la demande de jeton d'accès à l'API 42
        response = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                'client_id': 'u-s4t2ud-ab0a2c4d071ad2ab41a09ecc31c56a394d7d0ffe63be47f4cd76e20ae87e843e',
                'client_secret': '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',
                'code': code,
                'redirect_uri': 'http://localhost:3000/callback',
                'grant_type': 'authorization_code',
            }
        )

        # Retourner la réponse JSON de l'API 42 au client
        return JsonResponse(response.json())

    except Exception as e:
        # Gérer les erreurs et retourner une réponse appropriée
        return JsonResponse({'error': str(e)}, status=400)

