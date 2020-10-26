const jwt = require("jsonwebtoken");
const config = require("config");
const logger = require("../startup/logging");

function authentication(req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token) {
    logger.info("Invalid authentification token!");
    return res.status(401).send("Authentification token not found!");
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivatKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid authentification token!");
    logger.info("Invalid authentification token!");
  }
}

module.exports = authentication;
