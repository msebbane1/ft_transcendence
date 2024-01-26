# utils.py

class User:
    def __init__(self, username, ELO_score=0, _2FA_secret="", _2FA_status=False):
        self.username = username
        self.ELO_score = ELO_score
        self._2FA_secret = _2FA_secret
        self._2FA_status = _2FA_status

    def __str__(self):
        return self.username

