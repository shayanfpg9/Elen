const response = require("./functions/response");
const authorization = require("./middlewares/authorization");
require("dotenv").config();
const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  AtomsRouter = require("./routes/Atoms.route"),
  UsersRouter = require("./routes/Users.route"),
  helmet = require("helmet"),
  cros = require("cors"),
  rateLimit = require("express-rate-limit");

//middlewares:
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
});

app.use(limiter);

app.use(helmet());
app.use(express.json());
app.use(authorization);
app.use("/atoms", cros(), AtomsRouter);
app.use("/users", UsersRouter);

//404 error
app.all("*", cros(), (req, res) => {
  response({
    req,
    message: "page not found",
    error: true,
  })(res);
});

module.exports = app;
