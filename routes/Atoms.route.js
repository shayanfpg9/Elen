const { GetAll, GetSingle } = require("../controller/Atoms.controller");
const express = require("express"),
  router = express.Router();

//--------------------------------------------------------> Get

//router / Get -- All
router.get("/", GetAll);

//router / GET -- Single
router.get("/:name", GetSingle);

module.exports = router;
