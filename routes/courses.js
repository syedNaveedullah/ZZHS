const express = require("express");
const router = express.Router();
const app = express();
const wrapAsync = require("../utils/wrapAsync");

router.get("/", (req, res) => {
  res.render("course/courses.ejs");
});

router.get("/:className", (req, res) => {
  let { className } = req.params;
  res.render("course/subjects.ejs", { className });
});

router.get("/:className/:subject/:username", (req, res) => {
  let { className, subject, username } = req.params;
  res.send(`working ${className}...${subject}....${username}`);
});

module.exports = router;
