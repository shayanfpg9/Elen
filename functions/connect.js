const mongoose = require("mongoose");

//connecting function:
module.exports = {
  default: mongoose.set("strictQuery", true).connect,
  connection: mongoose.connection,
};
