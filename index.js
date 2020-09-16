const logger = require("./startup/logging");
const express = require("express");
const app = express();

require("./startup/config")();
require("./startup/mongodb")();
require("./startup/routes")(app);
require("./startup/prod")(app);

//Listening port
const port = process.env.port || 4458;
const server = app.listen(port, () => logger.info(`Listenning port ${port}`));

module.exports = server;
