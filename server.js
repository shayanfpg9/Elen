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
app.use("/api/atom/:lang/", AtomsRouter);
