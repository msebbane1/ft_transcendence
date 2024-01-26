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
    counter = int(time.time() / 30)
    counter_bytes = struct.pack('>Q', counter)
    hmac_value = hashlib.sha1(decoded_secret + counter_bytes).digest()
    return dynamic_truncation_fn(hmac_value) % 10 ** 6

def validate_code(code, secret):
    return generate_code(secret) == code

def generate_secret(data):
    hash_object = hashlib.md5(data.encode())
    hash_hex = hash_object.hexdigest()
    return base64.b32encode(hash_hex.encode()).decode().replace('=', '')


