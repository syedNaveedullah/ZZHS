const express = require("express");
const app = express();
const port = 4000;
const https = require("https");
// for json file
const fs = require("fs").promises;
// connecting views path
const path = require("path");
// for layouts in views
const ejsMate = require("ejs-mate");
// to parse req body
const bodyParser = require("body-parser");
// mongoose
const mongoose = require("mongoose");
// passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
//user model
const User = require("./models/user.js");
// subjects model
const Subject = require("./models/subjects.js");
// session
const session = require("express-session");
// handling errors
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// user routes
const userRouter = require("./routes/user.js");
// courses route
const coursesRoute = require("./routes/courses.js");
// for flashing errors and messages
const flash = require("connect-flash");

//for .env file
const dotenv = require("dotenv");
dotenv.config();
// require("dotenv").config(); //we can require it like this also

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// connecting to DB================================================
// mongoDB url
const mongoDB_url = process.env.MONGO_URL;

main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

//calling main to connect with DB
async function main() {
  await mongoose.connect(mongoDB_url);
}

//express sessions=====================================================
let sessionOptions = {
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 + 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
// flash
app.use(flash());

// passport initializing and running============================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// it save data in session and delete
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
//for parsing req body
app.use(express.urlencoded({ extended: true }));

//flash local variabls
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ****************************starting the server****************************
app.listen(port, () => {
  console.log("server is running");
  console.log("http://localhost:4000/");
});

// // for local https (creating local ssl cirtificate)
// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
//     allowedHosts: 'all',
//   },
//   app
// );
// sslServer.listen(port, () => {
//   console.log("server is running");
//   console.log("https://localhost:4000/");
// });

// Routes======================================================================
// index route
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// router routes==============================
//user
app.use("/", userRouter);
//Courses
app.use("/courses", coursesRoute);

//route for all incorrect route request------------------------------
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handling middlewares----------------------------------------
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});
