const express = require("express");
const multer = require("multer");
const User = require("../Module/Users");
const file = require("fs");
const jwt = require("jsonwebtoken");
const { restrictTo } = require("../Services & Authentications/authUser");
const { log } = require("console");
const Post = require("../Module/Posts");
const pvtKey = "harshil4636";
const path = require("path");
const twilio = require("twilio");

const userRouter = express.Router();

const updateProfileDiskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../FrontEnd/Social Media/src/assets/uploads/");
  },
  filename: async function (req, file, cb) {
    const result = await User.findOne({ email: req.user?.Email });
    console.log(result);

    let add = result.id + "-" + file.originalname;
    const updataedResult = await User.findOneAndUpdate(
      result._id,
      { imgAdd: "../assets/uploads/" + add },
      { new: true },
    );
    const data = await User.findById(updataedResult._id);
    // console.log(data);
    req.user = data;

    cb(null, add);
  },
});

const updateProfile = multer({ storage: updateProfileDiskStorage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../FrontEnd/Social Media/src/assets/uploads/");
  },
  filename: async function (req, file, cb) {
    const result = await User.create({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName,
      Fname: req.body.FullName[0],
      Lname: req.body.FullName[1],
    });
    let add = result.id + "-" + file.originalname;
    const updataedResult = await User.findOneAndUpdate(
      result._id,
      { imgAdd: "../assets/uploads/" + add },
      { new: true },
    );
    const data = await User.findById(updataedResult._id);
    // console.log(data);
    req.user = data;

    cb(null, add);
  },
});

const upload = multer({ storage: storage });

userRouter.get("/logout", async (req, res) => {
  // console.log("hellow");
  // req.user=null;
  res.clearCookie("token");

  return res.json({
    message: "Logged Out",
  });
});

userRouter.get("/api", restrictTo(), async (req, res) => {
  const result = await User.find({ email: req.user?.Email });
  res.json(result);
});

userRouter.get("/signUp", (req, res) => {
  res.redirect("http://localhost:5173/signUp");
});
userRouter.post("/signup", upload.single("picture"), async (req, res) => {
  if (!req.user) return res.redirect("/user/signup");

  const result = req.user;
  let token = jwt.sign({ Name: result.Fname, Email: result.email }, pvtKey);
  res.cookie("token", token);
  return res.redirect("http://localhost:5173/register");
});

userRouter.get("/login", (req, res) => {
  res.render("login");
});

userRouter.post("/login", async (req, res) => {
  if (req.body.email) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (user && user.password === req.body.password) {
        // console.log(user);

        let token = jwt.sign({ Name: user.Fname, Email: user.email }, pvtKey);

        res.cookie("token", token);
      }
      // console.log(req.cookies.token);

      return res.redirect("/");
    } catch (error) {}
  }
});

const post = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../FrontEnd/Social Media/src/assets/posts");
  },
  filename: async function (req, file, cb) {
    try {
      const user = await User.findOne({ email: req.user.Email });

      if (!user) {
        return cb(new Error("User not found"));
      }

      const post = await Post.create({
        userName: user.userName,
        caption: !req.body?.cap ? "EMPTY" : req.body.cap,
        createdBy: user._id,
      });

      const add = `${post._id.toString()}_${file.originalname}`;
      req.user.img = await Post.findByIdAndUpdate(post._id, {
        url: "../assets/posts/" + add,
      });

      cb(null, add);
    } catch (err) {
      cb(err);
    }
  },
});

const postImg = multer({
  storage: post,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
userRouter.post("/newPost", postImg.single("postImg"), async (req, res) => {
  // console.log("ok", req.body);
  const upId = req.user.img._id;
  await Post.findByIdAndUpdate(upId, { caption: req.body.cap });
  req.user.img = null;
  // console.log("ok Photo");
  res.json(req.file);
});

userRouter.get("/allPosts", async (req, res) => {
  const result = await User.findOne({ email: req.user?.Email });
  const posts = await Post.find({ createdBy: result?._id });
  // console.log(result._id);
  res.json(posts);
});

// Send All userNames

userRouter.get("/AllUsers", async (req, res) => {
  const users = await User.find(
    {},
    { userName: 1, imgAdd: 1, email: 1, _id: 0 },
  );
  res.json(users);
});

// send All User Data for the Search List

userRouter.get("/SearchList/Data", async (req, res) => {
  const data = await User.find({}, { userName: true, imgAdd: true, _id: 0 });
  // console.log(data);
  res.json(data);
});

// send pertular person data from the userName
userRouter.get("/this/:userName", async (req, res) => {
  // console.log(req.params.userName);
  const thisUser = await User.findOne({ email: req.user.Email });

  const user = await User.findOne({ userName: req.params.userName });
  const allPosts = await Post.find({ userName: req.params.userName });
  // console.log(allPosts);
  if (thisUser?.userName === req.params.userName) {
    return res.status(403);
  }
  res.json({ user, allPosts });
});

userRouter.post("/updateProfile", updateProfile.single("file"), (req, res) => {
  console.log(req.file);
  res.status(200);
});

userRouter.post("/sendOtp/:phoneNumber", async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  const accountSid = "AC798da7c5498b3cbe294e3ecaf8e093c5";
  const authToken = "fa4035252b696c329ea9f1b23ee2ab35";
  const client = new twilio(accountSid, authToken);

  // Send OTP via SMS using Twilio
  client.messages
    .create({
      body: `Your OTP code is ${otp}`,
      from: "+12345678901",
      to: "+91" + phoneNumber,
    })
    .then((message) => {
      // Store OTP in database or in-memory session (for verification)
      // You can store this OTP temporarily with a time limit (e.g., 5 minutes)
      // For demo, we will send it as a response
      res.json({ otp, message: "OTP sent successfully!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
module.exports = userRouter;
