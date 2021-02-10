const User = require("../models/userModel");
const catchAsync = require("../utils/asyncErrorCatcher");
const jwt = require("jsonwebtoken");
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const newUser = await User.create({ name, email, password, confirmPassword });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res
    .status(201)
    .send({ status: "success", accessToken: token, data: newUser });
});
