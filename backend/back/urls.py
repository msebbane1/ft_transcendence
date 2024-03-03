from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.views import LoginView
from back.views import login42, get_authorize_url, get_profile_image, get_infos_user, get_jwt_token, validate_2fa, enable_2fa, disable_2fa, get_qrcode, update_username, signup, signin, signintournament, checkalias, get_avatar_image, get_avatar, update_avatar_image, send_verification_code, get_avatar42_image, create_password_tournament, signout, add_friend, del_friend, get_following, begintournament, updatetournament, endtournament, pong2phistory, pong3phistory, stats_games, list_games

urlpatterns = [
    path('api/auth/authorize-url-42', get_authorize_url, name='get_authorize_url'),
    path('api/auth/login42', login42, name='login42'),
    path('api/signup/', signup, name='signup'),
    path('api/signin/', signin, name='signin'),
    path('api/signout/<int:id>/', signout, name='signout'),
    path('api/auth/2fa/', validate_2fa, name='validate_2fa'),
    path('api/auth/enable2fa/', enable_2fa, name='enable_2fa'),
    path('api/auth/disable_2fa/', disable_2fa, name='disable_2fa'),
    path('api/auth/qrcode/', get_qrcode, name='get_qrcode'),
    path('api/profileimage/', get_profile_image, name='get_profile_image'),
    path('api/userinfos/', get_infos_user, name='get_infos_user'),
    path('api/update-username/<int:id>/', update_username, name='update-username'),
    path('api/avatar/<int:avatar_id>/', get_avatar_image, name='get_avatar_image'),
    path('api/avatarup/<int:avatar_id>/', update_avatar_image, name='update_avatar_image'),
    path('api/avatar42/<int:avatar_id>/', get_avatar42_image, name='get_avatar42_image'),
    path('api/update-password/<int:id>/', create_password_tournament, name='create_password_tournament'),
    path('api/avatar/<int:id>/<int:avatar_id>/', get_avatar, name='get_avatar'),
    path('api/auth/2fa-email/', send_verification_code, name='send_verification_code'),
    path('api/get-tokenjwt/<int:id>/', get_jwt_token, name='get_jwt_token'),
    path('login/', LoginView.as_view(), name='login'),
    path('api/addFriend', add_friend, name='add_friend'),
    path('api/delFriend', del_friend, name='del_friend'),
    path('api/getFriends', get_following, name='get_following'),
    path('api/statsGames', stats_games, name='stats_games'),
    path('api/listGames', list_games, name='list_games'),
    path('api/signintournament/', signintournament, name='signintournament'),
    path('api/checkalias/', checkalias, name='checkalias'),
    path('api/begintournament/', begintournament, name='begintournament'),
    path('api/updatetournament/', updatetournament, name='updatetournament'),
    path('api/endtournament/', endtournament, name='endtournament'),
    path('api/pong3phistory/', pong3phistory, name='pong3phistory'),
    path('api/pong2phistory/', pong2phistory, name='pong2phistory'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

