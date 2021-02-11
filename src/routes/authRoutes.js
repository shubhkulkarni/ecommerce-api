const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  deactivateUser,
} = require("../controllers/userAuthController");

const {
  checkLoginRequest,
  protect,
  authorizeTo,
} = require("../middlewares/userAuth");

const authRouter = express.Router();

authRouter.route("/signup").post(signup);

authRouter.route("/login").post(checkLoginRequest, login);

authRouter.route("/forgot-password").post(forgotPassword);

authRouter.route("/reset-password/:token").patch(resetPassword);

authRouter.route("/update-password").post(protect, updatePassword);

authRouter
  .route("/deactivate-user/:id")
  .get(protect, authorizeTo("admin"), deactivateUser);

module.exports = authRouter;
