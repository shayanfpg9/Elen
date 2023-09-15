const response = require("./functions/response");
require("dotenv").config();
const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  AtomsRouter = require("./routes/Atoms.route"),
  UsersRouter = require("./routes/Users.route"),
  helmet = require("helmet"),
  cros = require("cors");

//middlewares:
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(cros());
app.use(express.json());
app.use("/atoms", AtomsRouter);
app.use("/users", UsersRouter);

//404 error
app.all("*", (req, res) => {
  response({
    req,
    message: "page not defined",
    error: true,
  })(res);
});

module.exports = app;
