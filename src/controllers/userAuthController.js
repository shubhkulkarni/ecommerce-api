const User = require("../models/userModel");
const catchAsync = require("../utils/asyncErrorCatcher");
const jwt = require("jsonwebtoken");
const { getAccessToken } = require("../utils/signToken");
const { findOne } = require("../models/userModel");
const AppError = require("../utils/Error");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    role,
  });
  const token = getAccessToken({ id: newUser._id });
  res.status(201).send({
    status: "success",
    accessToken: token,
    data: { id: newUser._id, name: newUser.name, email: newUser.email },
  });
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = user.createResetToken();

  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/reset-password/${resetToken}`;

  const message = `Forgot password ? send a patch request with new password to ${resetURL} . This url is valid for 10 mins after you receive this email !`;

  try {
    console.log({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).send({
      status: "success",
      message: "token is sent to registered email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        `Error sending email . Please try after some time. ${err}`,
        500
      )
    );
  }

  next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new AppError(
        "Invalid token. Kindly visit forgot-password link again.",
        401
      )
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const { confirmPassword, password, currentPassword } = req.body;
  const pwValidn = await user.matchPasswords(currentPassword, user.password);

  if (!pwValidn) {
    return next(
      new AppError("Incorrect password. Please enter correct password", 401)
    );
  }

  user.password = password;
  user.confirmPassword = confirmPassword;

  await user.save();

  const token = getAccessToken({ id: user._id });
  res.status(200).send({
    status: "success",
    message: "password is updated successfully",
    accessToken: token,
  });
  next();
});

exports.deactivateUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findOne({ _id: req.params.id });
  if (!currentUser) {
    return next(new AppError("User does not exist. Invalid user id", 404));
  }
  if (currentUser.accountStatus === "inactive") {
    res
      .status(200)
      .send({ status: 200, message: "User is already deactivated" });
  }

  currentUser.accountStatus = "inactive";
  await currentUser.save({ validateBeforeSave: false });
  res
    .status(200)
    .send({ status: "success", message: `User deactivated successfully` });
  next();
});
