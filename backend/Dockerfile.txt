FROM node:18
WORKDIR /app
RUN npm init -y && npm install express mongoose
COPY server.js .
EXPOSE 80
CMD ["node", "server.js"]