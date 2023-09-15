const UsersModel = require("../model/Users.model");
const response = require("../functions/response");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const key = require("../functions/key");

const PostSignup = async (req, res) => {
  const infomations = req.body;

  try {
    if (
      infomations.username === undefined ||
      infomations.name === undefined ||
      infomations.password === undefined ||
      infomations.role === undefined
    ) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    if (await UsersModel.findOne({ username: infomations.username })) {
      throw {
        status: 409,
        message: "Username has already exists in database",
      };
    }

    infomations.password = bcrypt.hashSync(infomations.password);
    const user = await UsersModel.create(infomations);
    const token = jwt.sign(
      {
        username: infomations.username,
      },
      key("private"),
      {
        algorithm: "RS256",
        expiresIn: "1h",
      }
    );

    response({
      req,
      status: 201,
      action: `signup`,
      data: {
        ...user.toObject(),
        token,
      },
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 500,
      error: true,
      action: `signup`,
      message: e?.message || e,
    })(res);
  }
};

const PostSignin = async (req, res) => {
  try {
    if (req.body.username === undefined || req.body.password === undefined) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    const { username, password } = req.body;
    const user = await UsersModel.findOne({ username });

    if (!bcrypt.compareSync(password, user.password)) {
      throw undefined;
    }

    const token = jwt.sign(
      {
        username: user.username,
      },
      key("private"),
      {
        algorithm: "RS256",
        expiresIn: "1h",
      }
    );

    response({
      req,
      status: 200,
      action: `signin`,
      data: {
        ...user.toObject(),
        token,
      },
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 401,
      error: true,
      action: `signin`,
      message: e?.message || e || "Invalid username or password",
    })(res);
  }
};

const Delete = async (req, res) => {
  try {
    const { username } = req.params;
    const password = req.body?.password;

    const user = await UsersModel.findOne({ username });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    if (
      username !== req.auth.username ||
      !password ||
      !bcrypt.compareSync(password, user.password)
    ) {
      throw { status: 403, message: "Forbidden for your token" };
    }

    await user.delete();

    response({
      req,
      status: 200,
      action: `delete user`,
      data: user,
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 401,
      error: true,
      action: `delete user`,
      message: e?.message || e,
    })(res);
  }
};

module.exports = {
  PostSignup,
  PostSignin,
  Delete,
};
