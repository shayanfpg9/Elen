const { log, setting } = require("./functions/logger");
const response = require("./functions/response");
require("dotenv").config();
const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  AtomsRouter = require("./routes/Atoms.route"),
  connect = require("./functions/connect").default;

//listen + connect to DB:

setting({
  save: false,
});

connect(process.env.MONGOURI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      log(`listening on port ${process.env.PORT}`, "success");
    });
  })
  .catch((e) => {
    log(e, "error");
  });

//middlewares:
app.use(morgan("dev"));
app.use(express.json());
app.use("/atom", AtomsRouter);

//404 error
app.all("*", (req, res) => {
  response({
    req,
    message: "page not defined",
    error: true,
  })(res);
});
