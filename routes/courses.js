const express = require("express");
const router = express.Router();
// for json file
const fs = require("fs").promises;
// connecting views path
const path = require("path");
// to parse req body
const bodyParser = require("body-parser");
// handling errors
const wrapAsync = require("../utils/wrapAsync");
//user model
const User = require("../models/user.js");
// subjects model
const Subject = require("../models/subjects.js");

//to open courses page
router.get("/", (req, res) => {
  res.render("course/courses.ejs");
});

// accessing available subjects from DB
router.get(
  "/accessData",
  wrapAsync(async (req, res) => {
    // Assuming the user ID is passed via query string or is available from req.user
    const userId = req.user._id;

    // Find the subject document based on the user ID and push "social2" to the subjects array
    const SubjectsArr = await Subject.findOne(
      { user: userId } // Find the subject document associated with the user
    );

    if (!SubjectsArr) {
      return res.status(404).send("No subject data found for the user.");
    }

    res.send(SubjectsArr);
  })
);

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

//============to open test page================================================
router.get(
  "/:className/:subject/:testNum",
  wrapAsync(async (req, res) => {
    let { className, subject, testNum } = req.params;

    // Construct the file path
    const filePath = path.join(
      __dirname,
      `../public/mcqs/${className}/${subject}/${testNum}.json`
    );

    // Reading the questions.json file using fs.promises
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
      subject: subject,
      testNum: testNum,
    });
  })
);

// updating the subjects array in DB for lock/unlock
// pushing into DB subject array=============================================
router.post("/10th/:subject/:id/pushingSub", async (req, res) => {
  let { subject, id } = req.params;
  try {
    // Assuming the user ID is passed via query string or is available from req.user
    const userId = req.user._id;

    // Find the subject document based on the user ID and push "social2" to the subjects array
    const updatedSubject = await Subject.findOneAndUpdate(
      { user: userId }, // Find the subject document associated with the user
      // { $push: { Mathematics: "social2" } }, // Push "social2" into the subjects array
      { $addToSet: { [subject]: `${id}` } }, // Push "social2" into the subjects array, if social2 already exists leave it
      { new: true } // Return the updated document
    );

    if (!updatedSubject) {
      return res.status(404).send("No subject document found for this user.");
    }
    res.send("Subject updated successfully: " + updatedSubject);
  } catch (error) {
    console.error("Error updating subject: ", error);
    res.status(500).send("An error occurred while updating subjects.");
  }
});

module.exports = router;
