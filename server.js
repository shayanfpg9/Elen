require("dotenv").config();
const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  AtomsRouter = require("./routes/Atoms.route");

//listen:
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

//middlewares:
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/atom/:lang/", (req, res, next) => {
  if (req.params.lang.match(/fa|en/g)) {
    return AtomsRouter[req.params.lang](req, res, next);
  } else {
    next();
  }
});
