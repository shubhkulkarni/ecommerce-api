const User = require("../models/userModel");
const catchAsync = require("../utils/asyncErrorCatcher");
const jwt = require("jsonwebtoken");
const { getAccessToken } = require("../utils/signToken");
const { findOne } = require("../models/userModel");
const AppError = require("../utils/Error");
const bcrypt = require("bcrypt");

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const newUser = await User.create({ name, email, password, confirmPassword });
  const token = getAccessToken({ id: newUser._id });
  res
    .status(201)
    .send({ status: "success", accessToken: token, data: newUser });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPasswords(password, user.password))) {
    return next(new AppError("incorrect email or password", 404));
  }

  //   let reqHash = bcrypt.compare(user.password, password);

  const token = getAccessToken({ id: user._id });

  res.status(200).send({
    status: "success",
    accessToken: token,
    data: { name: user.name, email: user.email },
  });
});
