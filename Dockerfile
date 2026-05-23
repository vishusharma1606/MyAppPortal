FROM node:23.7.0
WORKDIR /myapp
COPY . .
RUN npm install
EXPOSE 5001
CMD ["node", "server.js"]