const express = require("express");
const router = express.Router();
let User = require("../models/user.js");
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
    let { username, email, password } = req.body;
    // console.log(username, email, password);
    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `hello ${username}, Welcome to Zam Zam High School`);
      res.redirect("/");
    });
  } catch (err) {
    req.flash(
      "error",
      "A user with the given username or email is already registered"
    );
    res.redirect("/signup");
  }
});

// login route
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
