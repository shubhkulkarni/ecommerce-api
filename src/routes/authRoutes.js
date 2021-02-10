const express = require("express");
const { signup, login } = require("../controllers/userAuthController");
const { checkLoginRequest } = require("../middlewares/userAuth");

const authRouter = express.Router();

authRouter.route("/signup").post(signup);

authRouter.route("/login").post(checkLoginRequest, login);

module.exports = authRouter;
