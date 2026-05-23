FROM node:20.23.1
WORKDIR /myapp
COPY . .
RUN npm install
EXPOSE 5001
CMD ["node", "server.js"]
