const Controllers = require("../controller/Users.controller");
const verifyToken = require("../middlewares/verifyToken");
const UsersModel = require("../model/Users.model");
const express = require("express"),
  router = express.Router(),
  { body, param } = require("express-validator");

const validates = {
  signup: [
    body("username")
      .notEmpty()
      .isString()
      .custom((value) => {
        if (value.includes(" ")) {
          throw new Error("Shouldn't have space");
        }

        return true;
      }),
    body("name").notEmpty().isString(),
    body("password").notEmpty().isStrongPassword({
      minLength: 8,
      minSymbols: 1,
      minNumbers: 1,
      minUppercase: 1,
    }),
    body("role")
      .notEmpty()
      .custom((value) => {
        if (!["manager", "admin", "teacher", "student"].includes(value)) {
          throw new Error("Must be in list");
        }

        return true;
      }),
  ],
  signin: [
    body("username")
      .notEmpty()
      .isString()
      .custom(async (value) => {
        if (value.includes(" ")) {
          throw new Error("Shouldn't have space");
        }

        if (!(await UsersModel.findOne({ username: value }))) {
          throw new Error("Username in undefined");
        }

        return true;
      }),
    body("password").notEmpty().isString(),
  ],
  delete: [
    param("username")
      .notEmpty()
      .isString()
      .custom(async (value) => {
        if (value.includes(" ")) {
          throw new Error("Shouldn't have space");
        }

        return true;
      }),
    body("password").notEmpty().isString(),
  ],
};

//router / Post -- Signup
router.post("/signup", validates.signup, Controllers.PostSignup);

//router / Post -- signin
router.post("/signin", validates.signin, Controllers.PostSignin);

//router / Delete -- Delete
router.use("/delete/:username", validates.delete);
router.delete("/delete/:username", verifyToken, Controllers.Delete);

module.exports = router;
