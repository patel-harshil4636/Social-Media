const mongoose = require("mongoose");

const NotificatioShema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      default: function () {
        return this.type === "FOLLOW" ? "pending" : undefined; // Default status for "FOLLOW"
      },
      enum: ["pending", "accepted", "rejected"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      unique: true,
    },
    from: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", NotificatioShema);

module.exports = Notification;
