const key = require("../functions/key");
const response = require("../functions/response");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw "Unauthorized";
    }

    jwt.verify(token, key("public"), (err, decoded) => {
      if (err || !decoded.username) {
        throw "Invalid token";
      }

      req.auth = { username: decoded.username };
      next();
    });
  } catch (e) {
    response({
      req,
      status: e?.status || 401,
      error: true,
      action: `token verify`,
      message: e?.message || e,
    })(res);
  }
};

module.exports = verifyToken;
