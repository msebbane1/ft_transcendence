from django.urls import path
from back.views import get_all_user_data, get_authorize_url, get_profile_image, get_infos_user, validate_2fa, enable_2fa, disable_2fa, get_qrcode, update_username

urlpatterns = [
    path('api/auth/', get_authorize_url, name='get_authorize_url'),
    path('api/auth/callback/', get_all_user_data, name='get_all_user_data'),
    path('api/auth/2fa/', validate_2fa, name='validate_2fa'),
    path('api/auth/enable2fa/', enable_2fa, name='enable_2fa'),
    path('api/auth/disable_2fa/', disable_2fa, name='disable_2fa'),
    path('api/auth/qrcode/', get_qrcode, name='get_qrcode'),
    #path('api/auth/callback/', get_access_token, name='get_access_token'),
    path('api/profileimage/', get_profile_image, name='get_profile_image'),
    path('api/userinfos/', get_infos_user, name='get_infos_user'),
    path('api/update-username/<int:id>/', update_username, name='update-username'),

]

