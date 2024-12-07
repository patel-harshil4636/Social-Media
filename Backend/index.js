const express = require("express");
const staticRoute = require("./Route/Static");
const path = require("path");
const {
  authenticateToken,
  restrictTo,
} = require("./Services & Authentications/authUser");
const { default: mongoose } = require("mongoose");
const userRouter = require("./Route/Users");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Api = require("./Route/api");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/Users");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.resolve("./Views"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's URL
    credentials: true, // Allow cookies to be sent
  }),
);

app.use(authenticateToken);
app.use("/api", Api);

app.use("/user", userRouter);

app.use("/", restrictTo(), staticRoute);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
