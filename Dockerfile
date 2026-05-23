FROM node:20
WORKDIR /myapp
COPY . .
RUN npm install
EXPOSE 5001
CMD ["node", "server.js"]
