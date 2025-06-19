const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Store online users
let userCount = 0;

// ✅ Store chat history in memory (max 50 messages)
let messageHistory = [];

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  userCount++;
  io.emit("user count", userCount);

  // ✅ Send message history to the new user
  socket.emit("message history", messageHistory);

  // ✅ New user joins
  socket.on("new user", (name) => {
    socket.username = name;
    io.emit("notification", `${name} joined the chat`);
  });

  // ✅ Receive message and broadcast
  socket.on("chat message", (msg) => {
    messageHistory.push(msg);
    if (messageHistory.length > 50) messageHistory.shift();

    io.emit("chat message", msg);
  });

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    userCount--;
    io.emit("user count", userCount);
    if (socket.username) {
      io.emit("notification", `${socket.username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
