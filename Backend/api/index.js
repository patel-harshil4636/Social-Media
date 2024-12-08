const express = require("express");
const app = express();

// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

// Vercel expects this function to handle the request and response
module.exports = (req, res) => {
  return app(req, res);
};
