const messagesElement = document.getElementById("messages");

const messageInput = document.getElementById("messageInput");

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("mainChatMessages")) || [];

  messagesElement.innerHTML = "";

  if (messages.length === 0) {
    messagesElement.innerHTML = `
                <div class="empty-chat">
                    No messages yet
                </div>
            `;

    return;
  }

  messages.forEach((message) => {
    addMessageToUI(message);
  });
}

function addMessageToUI(message) {
  const messageElement = document.createElement("div");

  messageElement.classList.add("message");

  messageElement.innerHTML = `
            <div class="message-header">
                Admin · ${message.time}
            </div>

            <div class="message-text"></div>
        `;

  messageElement.querySelector(".message-text").textContent = message.text;

  messagesElement.appendChild(messageElement);

  messagesElement.scrollTop = messagesElement.scrollHeight;
}

function sendMessage() {
  const text = messageInput.value.trim();

  if (!text) {
    return;
  }

  const message = {
    text: text,

    time: new Date().toLocaleString(),
  };

  const messages = JSON.parse(localStorage.getItem("mainChatMessages")) || [];

  messages.push(message);

  localStorage.setItem("mainChatMessages", JSON.stringify(messages));

  messagesElement.innerHTML = "";

  messages.forEach((message) => {
    addMessageToUI(message);
  });

  messageInput.value = "";

  messageInput.focus();
}

messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();

    sendMessage();
  }
});

function publishPost() {
  const title = document.getElementById("blogTitle").value.trim();

  const content = document.getElementById("blogContent").value.trim();

  if (!title || !content) {
    alert("Please enter title and content.");

    return;
  }

  alert("Blog post published!");

  document.getElementById("blogTitle").value = "";
  document.getElementById("blogContent").value = "";
}

loadMessages();
