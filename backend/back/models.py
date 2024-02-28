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
    wins = models.SmallIntegerField()
    loses = models.SmallIntegerField()
    avatar = models.ForeignKey('Avatar', on_delete=models.SET_NULL, null=True)
    password_tournament = models.CharField(max_length=200, null=True)

    def __str__(self):
        output = f"Pseudo: {self.pseudo} ; 2auth: {self.has_2auth}"
        return output

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
	
