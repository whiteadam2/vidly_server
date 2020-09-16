const mongoose = require("mongoose");

function objectIdValidation(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid ID");
  next();
}

module.exports = objectIdValidation;
