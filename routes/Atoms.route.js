const Controllers = require("../controller/Atoms.controller");
const express = require("express"),
  router = express.Router();

//--------------------------------------------------------> Get

//router / Get -- All
router.get("/", Controllers.GetAll);

//router / GET -- Single
router.get("/:name", Controllers.GetSingle);

//router / POST -- Search
router.post("/search", Controllers.PostSearch)

module.exports = router;
