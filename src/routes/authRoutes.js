const express = require("express");
const {
  signup,
  login,
  forgotPassword,
} = require("../controllers/userAuthController");
const { checkLoginRequest } = require("../middlewares/userAuth");

const authRouter = express.Router();

authRouter.route("/signup").post(signup);

authRouter.route("/login").post(checkLoginRequest, login);

authRouter.route("/forgot-password").post(forgotPassword);

module.exports = authRouter;
