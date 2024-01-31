import pyotp
import hashlib
import base64
import struct
import time

def dynamic_truncation_fn(hmac_value):
    offset = hmac_value[-1] & 0xf
    truncated_value = (
        ((hmac_value[offset] & 0x7f) << 24) |
        ((hmac_value[offset + 1] & 0xff) << 16) |
        ((hmac_value[offset + 2] & 0xff) << 8) |
        (hmac_value[offset + 3] & 0xff)
    )
    return truncated_value

def generate_code(secret):
    decoded_secret = base64.b32decode(secret, casefold=True)
    buffer = bytearray(8)
    counter = int(time.time() / 30)
    for i in range(8):
        buffer[7 - i] = counter & 0xff
        counter >>= 8

    hmac_result = hmac.new(decoded_secret, bytes(buffer), hashlib.sha1).digest()
    return dynamic_truncation_fn(hmac_result) % (10 ** 6)

def validate_code(code, secret):
    return generate_code(secret) == code

def generate_secret(data):
    hash_object = hashlib.md5(data.encode())
    hash_hex = hash_object.hexdigest()

    while len(hash_hex) % 8 != 0:
        hash_hex += '0'

    return base64.b32encode(hash_hex.encode()).decode().replace('=', '')
#def generate_secret(data):
 #   hash_object = hashlib.md5(data.encode())
  #  hash_hex = hash_object.hexdigest()
   # return base64.b32encode(hash_hex.encode()).decode().replace('=', '')


