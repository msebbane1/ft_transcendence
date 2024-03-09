from datetime import datetime
from django.db import models
from django.utils import timezone
from django.contrib import admin

class User(models.Model):
    aliasname = models.CharField(max_length=15, default='')
    username = models.CharField(max_length=15)
    pseudo = models.CharField(max_length=15)
    password = models.CharField(max_length=200, null=True)
    register = models.BooleanField(default=False)
    secret_2auth = models.CharField(max_length=100)
    has_2auth = models.BooleanField(default=False)
    token_auth = models.CharField(max_length=100)
    token_jwt = models.CharField(max_length=1000, default='')
    avatar = models.ForeignKey('Avatar', on_delete=models.SET_NULL, null=True)
    password_tournament = models.CharField(max_length=200, null=True)
    status = models.CharField(max_length=20, default="offline")
    limit_status = models.CharField(max_length=20, default=datetime.now().strftime("%H:%M"))
    friends = models.ManyToManyField('self', through='Friendship' ,symmetrical=False)

    def __str__(self):
        output = f"Pseudo: {self.pseudo} ; 2auth: {self.has_2auth}"
        return output

    def follow(self, other_user):
        if not self.friends.filter(pk=other_user.pk).exists() and other_user is not self:
            Friendship.objects.create(from_f=self, to_f=other_user)

    def unfollow(self, other_user):
        Friendship.objects.filter(from_f=self, to_f=other_user).delete()

    def getFollowing(self):
        return User.objects.filter(to_f__from_f=self.id) # <==> self.friends.all()
	
    def getCountWinsPong(self):
        return int(self.winnerpong.all().count())
    
    def getCountWinsTTT(self):
        return int(self.winnerttt.all().count())
    
    def getCountLosesPong(self):
        return int(self.loserpong.all().count() + self.loserpong2.all().count())
    
    def getCountLosesTTT(self):
        return int(self.loserttt.all().count())
    
    def getCountDrawTTT(self):
        return int(self.draw_user1.all().count() + self.draw_user2.all().count())


class Friendship(models.Model):
	from_f = models.ForeignKey(User, on_delete=models.CASCADE, related_name='from_f', null=True, blank=True)
	to_f = models.ForeignKey(User, on_delete=models.CASCADE, related_name='to_f', null=True, blank=True)

	def __str__(self):
		return (f"{self.from_f} follow {self.to_f}")

class Avatar(models.Model):
    image = models.ImageField(upload_to="avatars", max_length=100)
    image_url_42 = models.URLField(default="")
    avatar_update = models.BooleanField(default=False)

    def __str__(self):
        return f'Avatar {self.id}'

class Tournament(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creator',  null=True, blank=True)
    title = models.CharField(max_length=30, default="Default Tournament")
    list_player_user = models.CharField(max_length=50, default='')
    list_player_other = models.CharField(max_length=50, default='')
    winner_t = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winner_t', null=True, blank=True)

    def __str__(self):
        return (f"{self.creator}'s Tournament")


class GamePong(models.Model):
    nb_players = models.SmallIntegerField(default=2)
    score = models.CharField(max_length=10)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winnerpong', default=None, null=True, blank=True)
    loser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loserpong', default=None, null=True, blank=True)
    loser2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loserpong2', default=None, null=True, blank=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, null=True, blank=True)
    date = models.CharField(max_length=20, default='')

    def __str__(self):
        l2_exist = f"and {self.loser2.username}" if self.loser2 else ''
        return (f"{self.winner.username} wins {self.score} against {self.loser.username} {l2_exist}")


class GameTTT(models.Model):
    is_draw = models.BooleanField(default=False)
    draw_user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='draw_user1', default=None, null=True, blank=True)
    draw_user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='draw_user2', default=None, null=True, blank=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winnerttt', default=None, null=True, blank=True)
    loser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loserttt', default=None, null=True, blank=True)
    date = models.CharField(max_length=20, default='')

    def __str__(self):
        if self.is_draw:
            return (f"Draw between {self.draw_user1} & {self.draw_user2}")
        return (f"{self.winner} wins against {self.loser}")
	
