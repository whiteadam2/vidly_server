const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  password: {
    type: String,
    minlength: 3,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
});

userSchema.methods.getAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivatKey")
  );
};

const User = mongoose.model("User", userSchema);

function validation(user) {
  const schema = {
    name: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    isAdmin: Joi.boolean().default(false).required(),
  };

  return Joi.validate(user, schema);
}

module.exports.validation = validation;
module.exports.User = User;
