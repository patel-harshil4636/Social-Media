const express = require("express");
const { authenticateToken } = require("../Services & Authentications/authUser");
// const {  } = require('../Services & Authentications/authUser');
const staticRoute = express.Router();

staticRoute.get("/", (req, res) => {
  res.redirect("http://localhost:5173/");
});

module.exports = staticRoute;
