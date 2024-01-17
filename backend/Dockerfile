FROM python:3.9

WORKDIR /app


# Copie du reste des fichiers de l'application
COPY . /app/

# Installation des dépendances
RUN python -m venv venv && . venv/bin/activate && pip install --no-cache-dir -r requirements.txt

# Exposition du port
EXPOSE 8080

# Commande pour exécuter le serveur avec SSL
CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8080", "--cert", "/app/nginx.crt", "--key", "/app/nginx.key", "--noreload"]

