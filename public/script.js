const socket = io();

// Reference to the username input element in the popup
const usernameInputPopup = document.querySelector(".username-input");

// Reference to the popup and its container
const popup = document.getElementById("username-popup");
const popupContent = document.querySelector(".popup-content");

// Open the popup when the page loads
window.addEventListener("load", () => {
  if (popup) {
    popup.style.display = "flex";
  }
});

// document.addEventListener("submit", (e) => {
popupContent.addEventListener("submit", (e) => {
  if (e.target.closest(".popup-content")) {
    // ...
    e.preventDefault();
    const username = usernameInputPopup.value.trim();

    if (username !== "") {
      // Close the popup
      popup.style.display = "none";

      // Set the username in the username input field
      const usernameInput = document.querySelector(".username-input");
      usernameInput.value = username;
    }
  }
});

// Rest of your existing code...

const memory = {};
const emojiDictionary = {
  ")": "😊",
  "(": "😢",
  D: "😄",
  "heart:": "❤️",
  "thumbsup:": "👍",
  "rocket:": "🚀",
  react: "⚛️",
  woah: "😲",
  hey: "👋",
  lol: "😂",
  like: "🤍",
  congratulations: "🎉",
  // Add more word-emoji pairs as needed
};

document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const usernameInput = document.querySelector(".username-input");
  const messageInput = document.querySelector(".message-input");
  const username = usernameInput.value.trim();
  let message = messageInput.value.trim().toLowerCase();

  // Handle slash commands
  if (message.startsWith("/")) {
    handleSlashCommand(message);
  } else {
    //Convert words to emojis in the message
    for (const word in emojiDictionary) {
      const emoji = emojiDictionary[word];
      message = message.replace(word, emoji);
    }

    if (username !== "" && message !== "") {
      socket.emit("chat message", { username, message });
      usernameInput.value = "";
      messageInput.value = "";
    }
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

function handleSlashCommand(command) {
  const parts = command.split(" ");
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case "/help":
      showHelpPopup();
      break;
    case "/random":
      generateRandomNumber();
      break;
    case "/clear":
      clearChat();
      break;
    case "/rem":
      handleRemCommand(args);
      break;
    case "/calc":
      handleCalcCommand(args);
      break;
    default:
      // Handle unknown commands
      break;
  }
}

function showHelpPopup() {
  alert(
    "Available slash commands:\n" +
      "/help - Show available commands\n" +
      "/random - Generate a random number\n" +
      "/clear - Clear the chat\n" +
      "/rem <name> <value>  Set a value and by the given name\n" +
      "/rem <name> recall the value\n" +
      "/calc <expression> will post the result of the calculator\n"
  );
}

function generateRandomNumber() {
  const randomNum = Math.floor(Math.random() * 100) + 1;
  socket.emit("chat message", {
    username: "System",
    message: `Generated random number: ${randomNum}`,
  });
}

function clearChat() {
  const messages = document.querySelector("#messages");
  messages.innerHTML = "";
}

function handleRemCommand(args) {
  if (args.length === 2) {
    const name = args[0];
    const value = args[1];
    memory[name] = value;
    socket.emit("chat message", {
      username: "System",
      message: `Stored value: ${value} under the name: ${name}`,
    });
  } else if (args.length === 1) {
    const name = args[0];
    if (memory.hasOwnProperty(name)) {
      socket.emit("chat message", {
        username: "System",
        message: `${memory[name]}`,
      });
    } else {
      socket.emit("chat message", {
        username: "System",
        message: `No value stored for the name: ${name}`,
      });
    }
  } else {
    socket.emit("chat message", {
      username: "System",
      message: "Usage: /rem <name> <value> or /rem <name> to recall",
    });
  }
}

function handleCalcCommand(args) {
  if (args.length === 1) {
    const expression = args[0];
    try {
      const result = eval(expression);
      socket.emit("chat message", {
        username: "System",
        message: `Result of calculation: ${result}`,
      });
    } catch (error) {
      socket.emit("chat message", {
        username: "System",
        message: "Invalid expression",
      });
    }
  } else {
    socket.emit("chat message", {
      username: "System",
      message: "Usage: /calc <expression>",
    });
  }
}
