const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const Genre = require("./genre").Genre;

const Movie = mongoose.model(
  "Movie",
  mongoose.Schema({
    title: { type: String, required: true, minlength: 3 },
    numberInStock: { type: Number, min: 0 },
    dailyRentalRate: { type: Number, min: 0 },
    genre: Genre.schema,
  })
);

function validation(movie) {
  const schema = {
    title: Joi.string().min(3).required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    genreId: Joi.objectId().required(),
  };

  return Joi.validate(movie, schema);
}

module.exports.validation = validation;
module.exports.Movie = Movie;
