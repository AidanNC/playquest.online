FROM node:lts AS development

WORKDIR /code

COPY ./backend/package.json /code/package.json
COPY ./backend/package-lock.json /code/package-lock.json
RUN npm ci


COPY ./backend /code
COPY ./gameEngine /gameEngine


RUN npm install -g bun

CMD [ "bun", "api_server.ts" ]