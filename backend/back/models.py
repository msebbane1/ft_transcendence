import datetime
from django.db import models
from django.utils import timezone
from django.contrib import admin



class User(models.Model):
    username = models.CharField(max_length=50)
    pseudo = models.CharField(max_length=50)
    password = models.CharField(max_length=200, null=True)
    register = models.BooleanField(default=False)
    secret_2auth = models.CharField(max_length=100)
    has_2auth = models.BooleanField(default=False)
    token_auth = models.CharField(max_length=100)
    token_jwt = models.CharField(max_length=1000, default='')
    wins = models.SmallIntegerField()
    loses = models.SmallIntegerField()
    avatar = models.ForeignKey('Avatar', on_delete=models.SET_NULL, null=True)
    password_tournament = models.CharField(max_length=200, null=True)
    status = models.CharField(max_length=20, default="offline")
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
	title = models.CharField(max_length=30)
	list_player = models.ManyToManyField(User)
	type_game = models.CharField(max_length=50)


class Game(models.Model):
	list_player = models.ManyToManyField(User, db_column='list_player', related_name='list_player')
	score = models.CharField(max_length=50)
	date_game = models.DateTimeField()
	duration_game = models.DurationField()
	type_game = models.CharField(max_length=50)
	in_game = models.BooleanField(default=False)
	winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winner')
	losers = models.ManyToManyField(User, db_column='losers', related_name='losers')
	tournament = models.ForeignKey(Tournament, default=None, on_delete=models.CASCADE)

	def __str__(self):
		output = "Players : "
		for player in self.list_player:
			output += f"{player} - "
		output = output[:len(output) - 2]
		output += f"\nScore : {self.score}"
		if (self.tournament != None):
			output += f"\nTournament : {self.tournament}"
		return (output)

	def is_game_complete(self):
		if (self.score ==  None or self.score == ''):
				return (False)
		if (self.date_game == None):
			return (False)
		now = timezone.now()
		if (self.type_game ==  None or self.type_game == ''):
			return (False)
		return (True)
	
	
