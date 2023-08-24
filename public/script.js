// const socket = io();

// const username = prompt("Please enter your username:");

// document.querySelector("#form").addEventListener("submit", (e) => {
//     e.preventDefault();
//     const messageInput = document.querySelector("#input");
//     const message = messageInput.value;
//     if (message.trim() !== "") {
//         socket.emit("chat message", { username, message });
//         messageInput.value = "";
//     }
// });

// socket.on("chat message", (msg) => {
//     const messages = document.querySelector("#messages");
//     const li = document.createElement("li");
//     li.textContent = `${msg.username}: ${msg.message}`;
//     messages.appendChild(li);
// });
const socket = io();

// const emojiDictionary = {
//   ":)": "😊",
//   ":(": "😢",
//   ":D": "😄",
//   ":heart:": "❤️",
//   ":thumbsup:": "👍",
//   ":rocket:": "🚀",
//   ":react": "⚛️",
//   ":woah": "😲",
//   ":hey": "👋",
//   ":lol": "😂",
//   ":like": "🤍",
//   ":congratulations": "🎉",
//   // Add more word-emoji pairs as needed
// };

const emojiDictionary = {
  ":\\)": "😊",
  ":\\(": "😢",
  ":D": "😄",
  ":heart:": "❤️",
  ":thumbsup:": "👍",
  ":rocket:": "🚀",
  ":react": "⚛️",
  ":woah": "😲",
  ":hey": "👋",
  ":lol": "😂",
  ":like": "🤍",
  ":congratulations": "🎉",
  // Add more word-emoji pairs as needed
};

document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const usernameInput = document.querySelector(".username-input");
  const messageInput = document.querySelector(".message-input");
  let username = usernameInput.value.trim();
  let originalMessage = messageInput.value.trim();
  let modifiedMessage = originalMessage;

  // Convert words to emojis in the message
  //   for (const word in emojiDictionary) {
  //     const emoji = emojiDictionary[word];
  //     message = message.replace(new RegExp(word, "g"), emoji);
  //   }

  // Convert words to emojis in the message
  for (const word in emojiDictionary) {
    const emoji = emojiDictionary[word];
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedWord, "g");
    modifiedMessage = modifiedMessage.replace(regex, emoji);
  }

  // if (username !== "" && message !== "") {
  //   socket.emit("chat message", { username, message });
  //   usernameInput.value = "";
  //   messageInput.value = "";
  // }
  if (username === "") {
    username = "Anonymous";
  }
  if (modifiedMessage !== "") {
    socket.emit("chat message", { username, message: modifiedMessage });
    usernameInput.value = "";
    messageInput.value = "";
  }
});

socket.on("chat message", (msg) => {
  const messages = document.querySelector("#messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";

  const usernameDiv = document.createElement("div");
  usernameDiv.className = "username";
  usernameDiv.textContent = msg.username;

  const textDiv = document.createElement("div");
  textDiv.textContent = msg.message;

  messageDiv.appendChild(usernameDiv);
  messageDiv.appendChild(textDiv);
  messages.appendChild(messageDiv);
});

const toggleTheme = document.getElementById("toggle-theme");
const messagesContainer = document.getElementById("messages");

toggleTheme.addEventListener("change", () => {
  if (toggleTheme.checked) {
    messagesContainer.style.backgroundColor = "#222";
    document.body.style.backgroundColor = "#333";
    document.body.style.color = "#fff";
  } else {
    messagesContainer.style.backgroundColor = "#f7f7f7";
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#000";
  }
});
