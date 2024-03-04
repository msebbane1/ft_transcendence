import json
import requests

def get_user_info(access_token):
    user_info_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(user_info_url, headers=headers)
    return response.json()
