const Controllers = require("../controller/Users.controller");
const verifyToken = require("../middlewares/verifyToken");
const express = require("express"),
  router = express.Router();

//--------------------------------------------------------> Post

//router / Post -- Signup
router.post("/signup", Controllers.PostSignup);

//router / Post -- signin
router.post("/signin", Controllers.PostSignup);

//--------------------------------------------------------> Delete

//router / Delete -- Delete
router.delete("/delete/:username", verifyToken, Controllers.Delete);

module.exports = router;
