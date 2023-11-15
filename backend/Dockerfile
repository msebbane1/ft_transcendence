# Utilisez l'image Python officielle en tant qu'image de base
FROM python:3.9

# Définissez le répertoire de travail
WORKDIR /app

# Copiez les fichiers nécessaires dans le conteneur
COPY requirements.txt /app/
COPY . /app/

# Installez les dépendances
#RUN pip install --no-cache-dir -r requirements.txt

RUN python -m venv venv && . venv/bin/activate && pip install --no-cache-dir -r requirements.txt

# Exposez le port sur lequel Django sera en cours d'exécution
EXPOSE 8080

# Commande pour démarrer le serveur Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080", "--noreload"]

