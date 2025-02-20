# Utilise une image Node.js officielle
FROM node:20

# Crée un dossier pour l'application
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code dans le conteneur
COPY . .

# Expose le port utilisé par l’application
EXPOSE 10000

# Commande pour démarrer le serveur
CMD ["node", "server.js"]
