const response = require("../functions/response");
const UsersModel = require("../model/Users.model");

async function authorization(req, res, next) {
  try {
    if (process.env.NODE_ENV !== "test") {
      const api_key = req.headers.authorization;
      const validKey = await UsersModel.findOne({
        api_key,
      });

      if (
        !(
          validKey &&
          (validKey.role === "admin" || validKey.role === "manager")
        ) &&
        !(validKey && !req.path.includes("/users"))
      ) {
        throw null;
      }
    }
  } catch (e) {
    response({
      req,
      status: 403,
      error: true,
      action: `authorization`,
      message: "you can't access to this page",
    })(res);

    return undefined;
  }

  next();
}

module.exports = authorization;
