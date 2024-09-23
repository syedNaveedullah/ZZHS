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

// course player route //from subject page
router.get("/:className/:subject", (req, res) => {
  // let { className, subject, username } = req.params; // thoda devlopment hone k baad ye line uncomment karna hai and route k parameters me :username add karna hai
  let { className, subject } = req.params;

  // if (!currentUser) {
  //   return res.status(400).send('User is not logged in');
  // }

  // res.send(`working ${className}...${subject}....${username}`);
  res.render("course/coursePlayer.ejs", {className, subject});
});

module.exports = router;
