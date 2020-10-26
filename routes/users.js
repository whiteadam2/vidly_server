const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { validation, User } = require("../models/user");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById({ _id: req.user.id }).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { name, password, email, isAdmin } = req.body;

  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already register!");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  user = new User({ name, password: hash, email, isAdmin });

  await user.save();
  const token = user.getAuthToken();

  res
    .header("x-auth-token", token)
    .header("Access-Control-Expose-Headers", "x-auth-token")
    .send(_.pick(user, ["name", "email", "password", "isAdmin"]));
});

module.exports = router;
