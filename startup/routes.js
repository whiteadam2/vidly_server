const express = require("express");
const genresRouter = require("../routes/genres");
const customersRouter = require("../routes/customers");
const mainRouter = require("../routes/main");
const moviesRouter = require("../routes/movies");
const rentalsRouter = require("../routes/rentals");
const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const returnsRouter = require("../routes/returns");
const logger = require("../startup/logging");
require("express-async-errors");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/genres", genresRouter);
  app.use("/api/customers", customersRouter);
  app.use("/api/movies", moviesRouter);
  app.use("/api/rentals", rentalsRouter);
  app.use("/api/returns", returnsRouter);
  app.use("/", mainRouter);
  app.use((err, req, res, next) => {
    logger.error(err.message);
    res.send(err.message);
  });
};
