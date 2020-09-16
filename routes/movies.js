const express = require("express");
const router = express.Router();
const { validation, Movie } = require("../models/movie");
const Genre = require("../models/genre").Genre;
const auth = require("../middleware/auth");

//Get all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

//Get customer by Id
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send(`Dont have movie with id ${req.params.id}`);
  res.send(movie);
});

//Add new movie
router.post("/", auth, async (req, res) => {
  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res
      .status(404)
      .send(`Author with ID ${req.body.genreId} doesnt exist`);

  const newMovie = new Movie({
    title: req.body.title,
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
    genre: {
      _id: genre.id,
      title: genre.title,
    },
  });

  await newMovie.save();
  res.send(newMovie);
});

//Update current movie
router.put("/:id", auth, async (req, res) => {
  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send(`Dont have movie with id ${req.params.id}`);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res
      .status(404)
      .send(`Author with ID ${req.body.genreId} doesnt exist`);

  movie.set({
    name: req.body.name,
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
    genre: {
      _id: genre.id,
      title: genre.title,
    },
  });

  await movie.save();
  res.send(movie);
});

//Delete movie
router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send(`Dont have movie with id ${req.params.id}`);

  res.send(movie);
});

module.exports = router;
