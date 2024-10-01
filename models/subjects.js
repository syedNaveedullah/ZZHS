const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const User = require("./user.js");

const subjectSchema = new Schema({
  Mathematics: {
    type: [String], // This defines that `subjects` will be an array of strings
  },
  Biology: {
    type: [String], // This defines that `subjects` will be an array of strings
  },
  Physics: {
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
