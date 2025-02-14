const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Fname: {
    required: true,
    type: String,
  },
  Lname: {
    required: true,
    type: String,
  },
  userName: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  imgAdd: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
