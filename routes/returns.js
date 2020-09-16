const express = require("express");
const mongoose = require("mongoose");

const { Rental, validation } = require("../models/rental");
const validationMiddleware = require("../middleware/validation");
const { Movie } = require("../models/movie");

const router = express.Router();
const auth = require("../middleware/auth");

router.post("/", [auth, validationMiddleware(validation)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental nt found");

  if (rental.dateReturned) return res.status(400).send("Already processed");

  rental.return();
  rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  return res.send(rental);
});

module.exports = router;
