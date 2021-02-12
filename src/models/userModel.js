const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new Schema({
  name: { type: String, required: [true, "name is required"], minLength: 2 },
  email: {
    type: String,
    required: [true, "email id is required"],
    unique: [true, "email id already exists"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "email id is invalid"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "confirmPassword is required"],
    trim: true,
    minLength: 8,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "passwords don't match",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin", "seller"],
    default: "user",
  },
  accountStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  cartItems: [{ type: Schema.ObjectId, ref: "Product" }],
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.matchPasswords = async function (requestPW, userPW) {
  return await bcrypt.compare(requestPW, userPW);
};

userSchema.methods.createResetToken = function (next) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model("User", userSchema);

module.exports = User;
