//Atoms schema:
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  UsersSchema = new Schema(
    {
      username: {
        type: "string",
        unique: true,
        required: true,
      },
      name: {
        type: "string",
        required: true,
      },
      password: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        enum: ["manager", "admin", "teacher", "student"],
        required: true,
      },
      developer: {
        type: "boolean",
        default: false,
      },
      api_key: {
        type: "string",
        unique: true,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Users", UsersSchema);
