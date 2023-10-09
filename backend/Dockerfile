# Utilisation d'une image Node.js LTS Alpine comme base
FROM node:lts-alpine

RUN npm install -g @nestjs/cli

WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel votre application NestJS écoute (le port doit correspondre à celui défini dans votre application NestJS)
EXPOSE 8080

# Commande pour démarrer l'application (ajustez-la en fonction de la manière dont vous démarrez votre application)
CMD ["npm", "run", "start"]

