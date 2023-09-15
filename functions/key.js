const fs = require("fs");

const key = (name) => {
  return fs.readFileSync(name + "_key.pem", { encoding: "utf-8" });
};

module.exports = key;
