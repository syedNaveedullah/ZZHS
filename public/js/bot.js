let conversationHistory = [];
// // getting query from user and response from llama3 api in this block
async function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (!message) return;

  // Add user's message to the conversation history
  conversationHistory.push({ role: "user", content: message });

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

  input.value = ""; // Clear the input field
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

// //now displaying chats of user and bot according to the parameters passed in this function==================================
function displayMessage(sender, text) {
  const messages = document.getElementById("messages");
  // Create the new message element
  const messageElem = document.createElement("li");

  // Map 'assistant' to 'bot' for styling purposes
  const senderClass = sender === "assistant" ? "bot" : sender;
  messageElem.className = `message ${senderClass}`;
  messageElem.textContent = text;
  // Append the new message to the chat
  messages.appendChild(messageElem);
  // Scroll to the new message
  messageElem.scrollIntoView({ behavior: "smooth", block: "end" });
}
