const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");
const User = require("../models/user").User;

router.post("/", async (req, res) => {
  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found");

  const login = await bcrypt.compare(req.body.password, user.password);
  if (!login) return res.status(400).send("Invalid password!");

  const token = user.getAuthToken();
  res.send(token);
});

function validation(user) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  };

  return Joi.validate(user, schema);
}

module.exports = router;
