from django.urls import path
from back.views import RequestForToken, AuthUrl, get_profile_image

urlpatterns = [
    path('auth/', AuthUrl, name='auth_url'),
    path('auth/callback/', RequestForToken, name='request_for_token'),
    path('profileimage/', get_profile_image, name='get_profile_image('),

    # ROUTES
]

