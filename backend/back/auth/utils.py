from back.models import User

def usernameAlreadyUse(new_username):
    try:
        user_count = User.objects.filter(username=new_username).count()
        return user_count > 0
    except User.DoesNotExist:
        return False

def pseudoAlreadyUse(new_username):
    try:
        user_count = User.objects.filter(pseudo=new_username).count()
        return user_count > 0
    except User.DoesNotExist:
        return False