const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      unique: false,
      required: true,
      type: String,
    },
    userName: {
      required: true,
      type: String,
    },
    url: {
      // required: true,
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: String,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
