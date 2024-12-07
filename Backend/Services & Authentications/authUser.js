const jwt = require("jsonwebtoken");
const pvtKey = "harshil4636";

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  // console.log("AUTHENTICSTE TOKEN",token);
  req.user = null;

  if (!token) return next();

  req.user = jwt.verify(token, pvtKey);
  return next();
}

const restrictTo = () => {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/user/signUp");
    // console.log("From Restrict to",req.user);
    next();
  };
};

module.exports = { authenticateToken, restrictTo };
