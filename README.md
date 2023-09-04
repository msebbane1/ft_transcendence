
# 1. VUE D'ENSEMBLE CONDITIONS

Utilisations

    • NestJS : Back-end
    • framework TypeScript : Front-end
    • Bibliotheques autorisées : Toutes, derniere version stable (React?) [A CHOISIR]
    • PostgreSQL : Base de données
    • NGINX - Open-source HTTP server

Lancement

    -> docker-compose up --build

# OUTILS

-> A completer..

Organisation

    • Notion
    • Figma

Front-end


Back-end

    • Prisma


# LIENS DOCKER / DEBIAN

DEBIAN :

    • Download : https://www.debian.org/releases/stable/
    • Tuto installation : https://github.com/codesshaman/inception/blob/main/00_INSTALL_SYSTEM.md

DOKER-COMPOSE :

    • Download :
    • Tuto nstallation:

# LIENS POUR FRONTEND BACKEND

# 2. Securite

• Tout mdp stocké dans la base de données doit être chiffré

• Utilisation d'un algorithme de hachage de mdp fort

• Un fichier .env ignoré par git qui contient : clés API, variables env, infos d'identifications, etc...

• Le site web doit être protégé contre les injections SQL

• Implémenter un système de validation côté serveur pour les formulaires et toute requête utilisateur.

# 3. Compte utilisateur

• L’utilisateur doit pouvoir :
- se loguer avec le système OAuth de l’intranet 42.
- choisir un nom d’utilisateur unique qui sera affiché sur le site
- télécharger un avatar. S’il n’en met pas, un avatar par défaut doit être affiché.
- activer l’authentification à deux facteurs, ou 2FA, comme Google Authenticator ou l’envoi d’un SMS sur son tel
- ajouter d’autres utilisateurs comme amis et voir leur statut en temps réel (en ligne, hors-ligne, en pleine partie, etc.).

• Des stats telles que : victoires et défaites, rang et niveaux, hauts faits... affichées sur le profil de l’utilisateur.

• Chaque utilisateur doit avoir un Match History (historique comportant les par-
ties 1 contre 1, les niveaux et ainsi de suite). Toute personne loguée doit pouvoir
le consulter.

# 4. Chat

• L’utilisateur doit pouvoir :
- créer des channels publics, privés, ou protégés par mot de passe.
- envoyer des direct messages à d’autres utilisateurs.
- bloquer d’autres utilisateurs (messages envoyés non visible par les comptes qu’il aura bloqués)

• Channels :
- L’utilisateur qui crée un nouveau channel devient son owner, jusqu’à ce qu’il le quitte.
- Le owner peut définir un mot de passe requis pour accéder au channel, le modifier, et le retirer.
◦ Le owner est aussi un administrateur. Il peut donner le rôle d’administrateur à d’autres utilisateurs.
◦ Un utilisateur qui est administrateur d’un channel peut expulser, bannir ou
mettre en sourdine (pour un temps limité) d’autres utilisateurs, mais pas les
owners du channel.

• Grâce a l'interface du chat :
- l’utilisateur doit pouvoir en inviter d’autres à faire une partie de Pong et accéder aux profils d’autres
joueurs.

# 5. Le jeu

• Un système de matching : l’utilisateur rejoint une file d’attente jusqu’à être matché automatiquement avec quelqu’un d’autre.

• Doit etre fidele au Pong

• Quelques options de customisation (des power-ups ou des maps différentes) mais l’utilisateur doit pouvoir jouer à la version par défaut sans options s’il le souhaite.

• Responsive


