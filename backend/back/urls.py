from django.urls import path
from back.views import RequestForToken, AuthUrl, get_profile_image, get_infos_user

urlpatterns = [
    path('api/auth/', AuthUrl, name='auth_url'),
    path('api/auth/callback/', RequestForToken, name='request_for_token'),
    path('api/profileimage/', get_profile_image, name='get_profile_image'),
    path('api/userinfos/', get_infos_user, name='get_infos_user'),

    # Autres routes...
]

