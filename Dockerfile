FROM node:22

WORKDIR /app

ENV JWT_SECRET=super_secure_secret_key
ENV JWT_SALT=random_salt_string
ENV RADISH_HOST=localhost
ENV RADISH_PORT=5100
ENV PORT=5002

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${PORT}

RUN chmod +x ./docker-run.sh

CMD ["sh", "./docker-run.sh"]

