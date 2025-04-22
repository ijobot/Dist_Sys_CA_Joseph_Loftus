const express = require("express");
const socketIo = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let userCount = 0;

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected!");

  const username = "user" + userCount++;

  socket.emit("set username", username);

  socket.on("chat message", (message) => {
    io.emit("chat message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("User has disconnected.");
  });
});

server.listen(3000, () => {
  console.log("Chat server is running!");
});
