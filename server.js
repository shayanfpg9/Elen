require("dotenv").config();
const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  AtomsRouter = require("./routes/Atoms.route"),
  LangRouter = require("./routes/Lang.route"),
  connect = require("./functions/connect");

//listen + connect to DB:

/* eslint-disable */
connect(process.env.MONGOURI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((e) => {
    console.error(e);
  });
/* eslint-enable */

//middlewares:
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/atom/", AtomsRouter);
app.use("/lang/", LangRouter);

//404 error
app.all("*", (req, res) => {
  res.status(404).json({
    method: req.method,
    action: undefined,
    path: req.path,
    error: {
      title: "Error 404",
      msg: "Action is undefined",
      status: 404,
    },
  });
});
