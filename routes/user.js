const express = require("express");
const router = express.Router();
let User = require("../models/user.js");
let Subject = require("../models/subjects.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const user = require("../models/user.js");

// routes==================
// signup route
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
  try {
    let { username, email, classYear, password } = req.body;
    let newUser = new User({ email, classYear, username });
    let registeredUser = await User.register(newUser, password);

    // Automatically log the user in after registration
    req.login(registeredUser, async (err) => {
      if (err) {
        return next(err);
      }

      // Check if the subject collection for this user already exists
      let userId = req.user._id;
      const cheakSubject = await Subject.findOne({ user: userId }); // Find the subject document associated with the user

      if (cheakSubject) {
        req.flash(
          "error",
          "A user with the given username or email is already registered"
        );
        return res.redirect("/signup"); // Use return to stop further execution
      }

      // If no subject collection exists, create a new one
      const newSubject = new Subject({
        Mathematics: ["MATHS1"],
        Biology: ["BIOLOGY1"],
        Physics: ["PHYSICS1"],
        Social: ["SOCIAL1"],
        classYear: classYear,
        user: userId,
      });
      await newSubject.save();

      // Redirect the user to the homepage after successful signup and subject creation
      req.flash("success", `Hello ${username}, Welcome to Zam Zam High School`);
      return res.redirect("/"); // Use return to avoid the "headers already sent" error
    });
  } catch (err) {
    // Handle error: user with the same email or username already exists
    req.flash(
      "error",
      "A user with the given username or email is already registered"
    );
    return res.redirect("/signup"); // Use return to avoid sending another response
  }
});

// login route===============================
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    let { username } = req.body;
    req.flash("success", `Welcome back ${username}`);
    console.log("loggedin");
    res.redirect("/");
  }
);

//logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout Success, see you again!!");
    res.redirect("/");
  });
});

module.exports = router;
