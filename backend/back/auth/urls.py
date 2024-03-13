from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import login42, get_authorize_url, get_profile_image, get_infos_user, get_jwt_token, get_jwt_tokenCookies, validate_2fa, disable_2fa, get_qrcode, signup, signin, logout

urlpatterns = [
    path('authorize-url-42/', get_authorize_url, name='get_authorize_url'),
    path('login42/', login42, name='login42'),
    path('signup/', signup, name='signup'),
    path('signin/', signin, name='signin'),
    path('logout/<int:id>/', logout, name='logout'),
    path('2fa/', validate_2fa, name='validate_2fa'),
    path('disable_2fa/', disable_2fa, name='disable_2fa'),
    path('qrcode/', get_qrcode, name='get_qrcode'),
    path('profileimage/', get_profile_image, name='get_profile_image'),
    path('userinfos/', get_infos_user, name='get_infos_user'),
    path('get-tokenjwt/<int:id>/', get_jwt_token, name='get_jwt_token'),
    path('get-tokenjwtCookies/<int:id>/', get_jwt_tokenCookies, name='get_jwt_tokenCookies'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

