const Controllers = require("../controller/Atoms.controller");
const express = require("express"),
  router = express.Router(),
  { body, param, query } = require("express-validator");

const validates = {
  single: [
    param("name").notEmpty().isString(),
    query("translate").optional().isString(),
  ],
  search: [
    body("query")
      .notEmpty()
      .custom((value) => {
        if (typeof value !== "string" && typeof value !== "number") {
          throw new Error("Invalid value");
        }

        return true;
      }),
    body("limit")
      .optional()
      .isNumeric()
      .custom((value) => {
        if (Number.isNaN(value)) {
          throw new Error("Invalid value");
        }

        return true;
      }),
  ],
};

//router / Get -- All
router.get("/", Controllers.GetAll);

//router / GET -- Single
router.get("/:name", validates.single, Controllers.GetSingle);

//router / POST -- Search
router.post("/search", validates.search, Controllers.PostSearch);

module.exports = router;
