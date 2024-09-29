const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const User = require("./user.js");

const subjectSchema = new Schema({
  maths_units: {
    type: [String], // This defines that `subjects` will be an array of strings
  },
  biology_units: {
    type: [String], // This defines that `subjects` will be an array of strings
  },
  physics_units: {
    type: [String], // This defines that `subjects` will be an array of strings
  },
  classYear: {
    type: Number,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
