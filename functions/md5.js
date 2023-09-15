const crypto = require("crypto");

const generateMD5 = (data) => {
  const hash = crypto.createHash("md5");
  hash.update(data);
  return hash.digest("hex");
};

module.exports = generateMD5;
