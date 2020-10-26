const logger = require("./startup/logging");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

require("./startup/config")();
require("./startup/mongodb")();
require("./startup/routes")(app);
require("./startup/prod")(app);

//Listening port
const port = process.env.PORT || 4459;
const server = app.listen(port, () => logger.info(`Listenning port ${port}`));

module.exports = server;
