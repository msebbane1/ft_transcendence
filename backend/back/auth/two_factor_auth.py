import pyotp
import hashlib
import base64
import struct
import time
import qrcode
from io import BytesIO

def dynamic_truncation_fn(hmac_value):
    offset = hmac_value[-1] & 0xf
    truncated_value = (
        ((hmac_value[offset] & 0x7f) << 24) |
        ((hmac_value[offset + 1] & 0xff) << 16) |
        ((hmac_value[offset + 2] & 0xff) << 8) |
        (hmac_value[offset + 3] & 0xff)
    )
    return truncated_value

def generate_secret(data=None):
    if data is None:
        data = ''
    hash_object = hashlib.md5(data.encode())
    hash_hex = hash_object.hexdigest()

    while len(hash_hex) % 8 != 0:
        hash_hex += '0'

    return base64.b32encode(hash_hex.encode()).decode().replace('=', '')

def check_valid_code(secret, code):
    totp = pyotp.TOTP(secret)
    return totp.verify(code)

def qrcode_generator(user: str, secret: str) -> str:
    uri = generate_google_uri(user, secret)
    image_data = to_data_url(uri)
    return image_data.replace("data:image/png;base64,", "")

def generate_google_uri(user: str, secret: str) -> str:
    return f'otpauth://totp/Transcendence:{user}?secret={secret}'

def to_data_url(uri: str) -> str:
    img = qrcode.make(uri)
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')


