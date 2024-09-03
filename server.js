const express = require("express");
const app = express();
const port = 4000;
// connecting views path
const path = require("path");

// middlewares
//setting ejs
app.set("view engin", "ejs");
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
