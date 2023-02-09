const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 1,
  },
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    unique: true,
  },
});
const User = mongoose.model("User", userSchema);

// for registering validattion using JOI
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
}

// for login validation using JOI
function validates(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validates = validates;
exports.validateUser = validateUser;
