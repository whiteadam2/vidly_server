const logger = require("../startup/logging");
const mongoose = require("mongoose");
const config = require("config");

mongoose.set("useCreateIndex", true);

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(logger.log({ level: "info", message: `${db} Mongodb connected!` }));
};
