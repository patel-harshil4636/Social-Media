const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
  },
  followers: {
    type: [String],
    default: [],
  },
  Following: {
    type: [String],
    default: [],
  },
});

const FFData = mongoose.model("FolowersData", followerSchema);
module.exports = FFData;
