const express = require("express");
const router = express.Router();
const { validation, Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const validationObjectId = require("../middleware/validationObjectId");

//Get all genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().select("-__v");
  res.send(genres);
});

//Get genre by Id
router.get("/:id", validationObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id).select("-__v");
  if (!genre)
    return res.status(404).send(`Dont have genre with id ${req.params.id}`);
  res.send(genre);
});

//Add new genre
router.post("/", auth, async (req, res) => {
  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const newGenre = new Genre({ title: req.body.title });
  await newGenre.save();
  res.send(newGenre);
});

//Update current genre
router.put("/:id", [auth, validationObjectId], async (req, res) => {
  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findById(req.params.id).select("-__v");

  if (!genre)
    return res.status(404).send(`Dont have genre with id ${req.params.id}`);

  genre.title = req.body.title;
  await genre.save();
  res.send(genre);
});

//Delete genre
router.delete("/:id", [auth, admin, validationObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send(`Dont have genre with id ${req.params.id}`);

  res.send(genre);
});

module.exports = router;
