const socket = io();

const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messages = document.getElementById("messages");
const userCountSpan = document.getElementById("user-count");
const toggleBtn = document.getElementById("toggle-theme");

let username = "";

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  username = usernameInput.value.trim();
  if (username) {
    loginScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    socket.emit("new user", username);
  }
});

messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { name: username, text, time };
    socket.emit("chat message", msg);
    messageInput.value = "";
  }
});

socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.innerHTML =
    
