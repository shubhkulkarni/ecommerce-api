const User = require("../models/userModel");
const catchAsync = require("../utils/asyncErrorCatcher");
const AppError = require("../utils/Error");
const jwt = require("jsonwebtoken");

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(new AppError("Unauthorized. Please log in to proceed.", 401));
  }

  let token = authorization.split(" ")[1];

  if (!token) {
    return next(new AppError("Unauthorized. Please log in to proceed.", 401));
  }

  const tokenValidn = await new Promise((resolve, reject) =>
    resolve(jwt.verify(token, process.env.JWT_SECRET_KEY))
  );

  if (!tokenValidn || !(await User.findById(tokenValidn.id))) {
    return next(new AppError("Invalid token. Unauthorized.", 401));
  }

  next();
});

exports.checkLoginRequest = async (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res
      .status(400)
      .send({ status: 400, message: "Bad request ! data is inappropriate" });
  }
  next();
};
