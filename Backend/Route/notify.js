const express = require("express");
const {
  authenticateToken,
  restrictTo,
} = require("../Services & Authentications/authUser");
const Notify = express.Router();

const cors = require("cors");
const Notification = require("../Module/Notifications");
const User = require("../Module/Users");
const {
  getCurrentUser,
  findUserName,
} = require("../Services & Authentications/finds");
Notify.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
Notify.get("/allNotification", async (req, res) => {
  const userData = await User.findOne({ email: req.user.Email });
  // console.log(userData);
  const allNotifications = await Notification.find({
    userName: userData.userName,
  }).sort({ timestamp: -1 });
  res.json(allNotifications);
});

Notify.delete("/delete/:userName", async (req, res) => {
  // const currentUser = await User.findOne({email:req.user.Email});
  // const deleteNotification = await Notification.deleteOne({userName:req.params.userName,from:currentUser.userName});
  // console.log(deleteNotification);
  // res.json(deleteNotification);
});


// when the user check the another user 
Notify.get("/checkedprofile/:userName", async (req, res) => {
  const currentUser = await getCurrentUser(req.user.Email);
  //  console.log('Current User',currentUser);
  const profilerUser = await findUserName(req.params.userName);
  //  console.log('This  User',profilerUser);

try {
  const ProfileChecked = await Notification.create({
    from: currentUser?.userName,
    message: `${currentUser?.userName} has Seen Your Profile`,
    userName: profilerUser.userName,
    type: "PROFILE_CHECKED",
    userId: profilerUser._id,
  });
  
} catch (error) {
  console.log('same date from /notify/checkprofile ');
  
}
});
module.exports = Notify;
