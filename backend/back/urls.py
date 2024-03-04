from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.views import LoginView
from back.views import signintournament, checkalias, add_friend, del_friend, get_following, begintournament, updatetournament, endtournament, pong2phistory, pong3phistory, stats_games, list_games

urlpatterns = [
    path('api/auth/', include('back.auth.urls')),
    path('api/user/', include('back.user.urls')),
    #path('api/tournament/', include('back.tournament.urls')),

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

