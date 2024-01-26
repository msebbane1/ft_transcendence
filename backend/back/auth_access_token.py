import json
import requests

def get_access_token(client_id, client_secret, code, redirect_uri):
    token_url = 'https://api.intra.42.fr/oauth/token/'
    response = requests.post(
        token_url,
        data={
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }
    )
    return response.json().get('access_token')
