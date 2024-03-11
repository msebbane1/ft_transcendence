from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.views import LoginView
from .views import update_username, get_avatar, update_avatar_image, create_password_tournament

urlpatterns = [
    path('update-username/<int:id>/', update_username, name='update-username'),
    path('update-avatar/<int:avatar_id>/', update_avatar_image, name='update_avatar_image'),
    path('update-password/<int:id>/', create_password_tournament, name='create_password_tournament'),
    path('avatar/<int:id>/<int:avatar_id>/', get_avatar, name='get_avatar'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

