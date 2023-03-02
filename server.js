const { default: mongoose } = require("mongoose");

require("dotenv").config();
const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  AtomsRouter = require("./routes/Atoms.route"),
  connect = require("./functions/connect");

//listen + connect to DB:
connect(process.env.MONGOURI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((e) => {
    console.error(e);
  });

//middlewares:
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/atom/", AtomsRouter);
