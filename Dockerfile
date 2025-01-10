FROM node:lts-alpine 
ENV NODE_ENV=production
ENV PAPRIKA_USERNAME=none
ENV PAPRIKA_PASSWORD=none

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN echo "Foo"
RUN npm install --production
RUN mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
