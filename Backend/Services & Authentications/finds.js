const User = require("../Module/Users");

const getCurrentUser = async (email) => {
  const result = await User.findOne({ email: email });
  return result ? result : null;
};

const findUserName = async (userName) => {
  const result = await User.findOne({ userName: userName });
  return result ? result : null;
};
module.exports = { getCurrentUser, findUserName };
