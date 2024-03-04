import hashlib
import random
import string

#ALGO SHA256
def hash_password(password):

    salt = ''.join(random.choices(string.ascii_letters + string.digits, k=12))

    salted_password = password + salt

    hashed_password = hashlib.sha256(salted_password.encode()).hexdigest()

    return f"{hashed_password}${salt}"

