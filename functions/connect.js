const mongoose = require("mongoose");

module.exports = mongoose.set("strictQuery", true).connect;
