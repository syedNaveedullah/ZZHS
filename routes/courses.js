const express = require("express");
const router = express.Router();
const app = express();
// for json file
const fs = require("fs").promises;
// connecting views path
const path = require("path");
// to parse req body
const bodyParser = require("body-parser");
// handling errors
const wrapAsync = require("../utils/wrapAsync");

//to open courses page
router.get("/", (req, res) => {
  res.render("course/courses.ejs");
});

// to open specific class================================================================================
router.get("/:className", (req, res) => {
  let { className } = req.params;
  res.render("course/subjects.ejs", { className });
});

// course player route //from subject page //to open specific subject page===============================================
router.get("/:className/:subject", (req, res) => {
  // let { className, subject, username } = req.params; // thoda devlopment hone k baad ye line uncomment karna hai and route k parameters me :username add karna hai
  let { className, subject } = req.params;

  // if (!currentUser) {
  //   return res.status(400).send('User is not logged in');
  // }

  // res.send(`working ${className}...${subject}....${username}`);
  res.render("course/coursePlayer.ejs", { className, subject });
});

// to open test page=========================================================================================
router.get(
  "/:className/:subject/:testNum",
  wrapAsync(async (req, res) => {
    let { className, subject, testNum } = req.params;

    // Construct the file path
    const filePath = path.join(
      __dirname,
      `../public/mcqs/${className}/${subject}/${testNum}.json`
    );

    // Read the questions.json file using fs.promises
    const data = await fs.readFile(filePath, "utf-8");

    let questions;
    try {
      // Parse the JSON data
      questions = JSON.parse(data);
    } catch (parseError) {
      // Handle JSON parsing error
      return res.status(500).send("Error parsing questions file");
    }

    // Extract correct answers from the questions array
    const correctAnswers = {};
    questions.questions.forEach((question, index) => {
      correctAnswers[`q${index + 1}`] = question.correctAnswer;
    });

    // Render the EJS template and pass the questions data
    res.render("quiz", {
      questions: questions.questions,
      correctAnswers: correctAnswers,
    });
  })
);

module.exports = router;
