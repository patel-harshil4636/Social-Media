const express = require("express");
const staticRoute = require("./Route/Static");
const path = require("path");
const cors = require("cors");
const http = require("http");
const {
  authenticateToken,
  restrictTo,
} = require("./Services & Authentications/authUser");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");
const userRouter = require("./Route/Users");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const Api = require("./Route/api");
const Notify = require("./Route/notify");
const post = require("./Route/Post");
const app = express();

// Middleware for CORS

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  }),
);

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/SocialMedia");

// Middleware setup
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.resolve("./Views"));

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
  },
});

// Middleware for authentication
app.use(authenticateToken);

// Socket.IO logic
io.on("connection", (socket) => {
  // console.log('a user connected:', socket.id);

  socket.on("join", (userId) => {
    socket.join(userId); // Create or join a room for the user
    // console.log(` User ${userId} joined room `);
  });

  socket.on("disconnect", () => {
    // console.log('user disconnected:', socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io; // Attach `io` instance to `req`
  next();
});
// Define routes
app.use("/api", Api);
app.use("/user", userRouter);
app.use("/notify", Notify);
app.use("/", restrictTo(), staticRoute);

app.use("/post", post);

// Start server on port 8000
server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
