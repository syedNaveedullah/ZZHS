async function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value;
  if (!message) return;

  // Display user message
  displayMessage("user", message);

  // Send message to the server
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  displayMessage("bot", data.response);

  input.value = ""; // Clear input field
}

// displaying chats
function displayMessage(sender, text) {
  const messages = document.getElementById("messages");
  const messageElem = document.createElement("li");
  messageElem.className = `message ${sender}`;
  messageElem.textContent = text;
  messages.appendChild(messageElem);
  messages.scrollTop = messages.scrollHeight; // Scroll to the bottom

  // Ensure the DOM is updated before scrolling
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 100);
}
