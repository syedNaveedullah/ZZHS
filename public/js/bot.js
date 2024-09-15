let conversationHistory = [];

// Sending the user's message and getting the bot's response from the API
async function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (!message) return;

  // Add user's message to the conversation history
  conversationHistory.push({ role: "user", content: message });

  input.value = ""; // Clear the input field

  // Display user message in the chat window
  displayMessage("user", message);

  // Send the conversation history to the server
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation: conversationHistory }),
  });

  const data = await response.json();

  // Add bot's response to the conversation history with the correct role
  conversationHistory.push({ role: "assistant", content: data.response });

  // Display bot message in the chat window
  displayMessage("assistant", data.response);
}

// Add keydown event listener for the Enter key
document
  .getElementById("messageInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents adding a new line
      sendMessage(); // Trigger the send message function
    }
  });

// Display messages with HTML formatting
function displayMessage(sender, text) {
  const messages = document.getElementById("messages");
  const messageElem = document.createElement("li");

  // Map 'assistant' to 'bot' for styling purposes
  const senderClass = sender === "assistant" ? "bot" : sender;
  messageElem.className = `message ${senderClass}`;

  // Use innerHTML instead of textContent to support formatted content
  messageElem.innerHTML = formatMessage(text);

  messages.appendChild(messageElem);
  messageElem.scrollIntoView({ behavior: "smooth", block: "end" });
}

function formatMessage(text) {
  // Parsing for headings, subheadings, bullet points, and other formatting
  let formattedText = text
    .replace(/(?:\*\*|__)([^*_]+)(?:\*\*|__)/g, "<strong>$1</strong>") // Bold text
    .replace(/(?:\*|_)([^*_]+)(?:\*|_)/g, "<em>$1</em>") // Italic text
    .replace(/\n### (.+)/g, "<h3>$1</h3>") // Sub-subheadings (###)
    .replace(/\n## (.+)/g, "<h2>$1</h2>") // Subheadings (##)
    .replace(/\n# (.+)/g, "<h1>$1</h1>") // Main headings (#)
    .replace(/\n(\d+)\. (.+)/g, "<li>$2</li>") // List items (numbers)
    .replace(/\n\* (.+)/g, "<li>$1</li>"); // Bullet points (*)

  // Wrap the list items in <ol> or <ul> appropriately
  formattedText = formattedText.replace(/(<li>.+<\/li>)/g, "<ol>$1</ol>");
  formattedText = formattedText.replace(/<\/ol><ol>/g, ""); // Merge consecutive <ol>

  return formattedText;
}
