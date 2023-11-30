from django.urls import path
from back.views import RequestForToken, AuthUrl

urlpatterns = [
    path('auth/', AuthUrl, name='auth_url'),
    path('auth/callback/', RequestForToken, name='request_for_token'),

    # ROUTES
]

