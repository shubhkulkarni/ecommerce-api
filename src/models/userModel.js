const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  this.confirmPassword = undefined;
  next();
});

const User = model("User", userSchema);

module.exports = User;
