const mongoose = require("mongoose");

//connecting function:
module.exports = mongoose.set("strictQuery", true).connect;
