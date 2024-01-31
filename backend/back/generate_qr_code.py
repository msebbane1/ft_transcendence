import qrcode
from io import BytesIO
import base64

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

