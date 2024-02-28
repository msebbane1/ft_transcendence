from io import BytesIO
import requests
from PIL import Image
import base64

def get_base64_from_buffer(buffer):
    print("=> Resizing to 128x128 pixels...")
    # Convertir le buffer en image PIL
    image = Image.open(BytesIO(buffer))
    # Redimensionner l'image
    image = image.resize((128, 128))
    # Convertir l'image en format JPEG et la stocker dans un tampon BytesIO
    with BytesIO() as output:
        image.save(output, format='JPEG', quality=50)
        resized_buffer = output.getvalue()
    print("=> Converting to base64...")
    # Convertir le tampon en base64
    base64_string = base64.b64encode(resized_buffer).decode('utf-8')
    return base64_string

def get_base64_from_uri(uri):
    print(f"Fetching avatar from {uri}...")
    # Récupérer l'image depuis l'URL
    response = requests.get(uri)
    # Convertir la réponse en buffer
    buffer = response.content
    # Appeler la fonction précédente pour convertir le buffer en base64
    return get_base64_from_buffer(buffer)

