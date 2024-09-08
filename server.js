const express = require("express");
const app = express();
const port = 4000;
// connecting views path
const path = require("path");
// for layouts in views
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
//for .env file
const dotenv = require("dotenv");
dotenv.config();
// require("dotenv").config(); //we can require it like this also

// Middleware to parse JSON bodies
app.use(bodyParser.json());

//============for llama api bot code===============================
const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
  console.error("ERROR: GROQ_API_KEY is not defined.");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Function to get chat completion from Groq API
async function getGroqChatCompletion(conversation) {
  try {
    const response = await groq.chat.completions.create({
      messages: conversation, // Send the entire conversation
      model: "llama3-70b-8192",
    });

    return (
      response.choices[0]?.message?.content || "No response from the model."
    );
  } catch (error) {
    console.error(
      "Error communicating with Groq API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error communicating with Groq API");
  }
}

// Endpoint to handle chatbot requests
app.post("/chat", async (req, res) => {
  const conversation = req.body.conversation; // Conversation history

  try {
    const botResponse = await getGroqChatCompletion(conversation);
    res.json({ response: botResponse });
  } catch (error) {
    res.status(500).send("Error communicating with Groq API");
  }
});

app.get("/bot", (req, res) => {
  res.render("bot.ejs");
});

// ================================================================

// middlewares
//setting ejs
app.set("view engine", "ejs");
// use ejs-locals for all ejs templates:====like layouts/bolierplate.ejs
app.engine("ejs", ejsMate);
// setting path for views
app.set("views", path.join(__dirname, "views"));
// path for static
app.use(express.static(path.join(__dirname, "public")));

// starting the server
app.listen(port, () => {
  console.log("server is running");
  console.log("http://localhost:4000/");
});

// Routes
// index route
app.get("/", (req, res) => {
  res.render("index.ejs");
});
