from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.views import LoginView
from .views import update_username, get_avatar, update_avatar_image, create_password_tournament, add_friend, del_friend, get_following, stats_games, list_games

urlpatterns = [
    path('update-username/<int:id>/', update_username, name='update-username'),
    path('update-avatar/<int:avatar_id>/', update_avatar_image, name='update_avatar_image'),
    path('update-password/<int:id>/', create_password_tournament, name='create_password_tournament'),
    path('avatar/<int:id>/<int:avatar_id>/', get_avatar, name='get_avatar'),
#A CHANGER URL PLUS TARD
    path('api/addFriend', add_friend, name='add_friend'),
    path('api/delFriend', del_friend, name='del_friend'),
    path('api/getFriends', get_following, name='get_following'),
    path('api/statsGames', stats_games, name='stats_games'),
    path('api/listGames', list_games, name='list_games'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

