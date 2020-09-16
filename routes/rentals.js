const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const router = express.Router();
const { validation, Rentals } = require("../models/rental");
const Customer = require("../models/customer").Customer;
const Movie = require("../models/movie").Movie;
const Rental = require("../models/rental").Rental;
const auth = require("../middleware/auth");

Fawn.init(mongoose);

router.post("/", auth, async (req, res) => {
  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) res.status(400).send(`Invalid Customer`);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) res.status(400).send(`Invalid Movie`);

  if (movie.numberInStock === 0)
    res.status(400).send("There is not available for renting");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  new Fawn.Task()
    .save("rentals", rental)
    .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
    .run();

  res.send(rental);
});

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

module.exports = router;
