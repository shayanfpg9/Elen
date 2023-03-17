const Controllers = require("../controller/Lang.controller");
const express = require("express"),
  router = express.Router();

//router / Get -- Lang
router.get("/:lang", Controllers.GetLang);

module.exports = router;
