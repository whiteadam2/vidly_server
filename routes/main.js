//router for "/" rout
const express = require("express");
const mainRouter = express.Router();
const pug = require("pug");

const compiledFunction = pug.compileFile("./views/index.pug");

mainRouter.get("/", (req, res) => {
  res.send(
    compiledFunction({
      title: "main page",
      h1: "our topic",
    })
  );
});

module.exports = mainRouter;
