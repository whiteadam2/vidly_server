const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
});
const Genre = mongoose.model("Genre", genreSchema);

//Validation of adding new genre
function validation(genre) {
  const schema = {
    title: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(genre, schema);
}

module.exports.validation = validation;
module.exports.Genre = Genre;
