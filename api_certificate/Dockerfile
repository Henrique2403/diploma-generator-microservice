# Use a imagem oficial do Node.js do Docker Hub
FROM node:14

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install mysql2 amqplib redis date-fns uuid@8.x swagger-jsdoc swagger-ui-express

# Copia o resto do código
COPY . .

# Expôe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "index.js"]