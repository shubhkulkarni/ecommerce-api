const User = require("../models/userModel");
const catchAsync = require("../utils/asyncErrorCatcher");

exports.protect = catchAsync(async (req, res, next) => {});

exports.checkLoginRequest = async (req, res, next) => {
    if (!req.body || !req.body.email || !req.body.password) {
      res
        .status(400)
        .send({ status: 400, message: "Bad request ! data is inappropriate" });
    }
    next();
  };
