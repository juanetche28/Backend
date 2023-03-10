const socket = io();

const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("input", function (ev) {
  socket.emit("input-message", ev.target.value);
});

const sendButton = document.getElementById("send-button");
sendButton.addEventListener("click", function (ev) {
  socket.emit("chat-message", chatInput.value);
});

const inputMessage = document.getElementById("input-message");
socket.on("input-message", (data) => {
  inputMessage.innerText = data;
});

const chatMessages = document.getElementById("chat-messages");
socket.on("chat-messages-updated", (data) => {
  chatMessages.innerHTML = "";

  for (const el of data) {
    const li = document.createElement("li");
    li.innerText = `${el.socketId}: ${el.message}`;
    chatMessages.appendChild(li);
  }
});
