from django.contrib import admin

from .models import User, GamePong, Tournament

admin.site.register(User)
admin.site.register(GamePong)
admin.site.register(Tournament)


