const crypto = require("crypto");

function encrypt(body, key) {
  const iv = "\x00".repeat(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedBody = cipher.update(JSON.stringify(body), "utf-8", "base64");
  encryptedBody += cipher.final("base64");
  return encryptedBody;
}

function decrypt(body, key) {
  const iv = "\x00".repeat(16);
  const cipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "base64"),
    iv
  );
  let decryptedBody = cipher.update(body, "base64", "utf-8");
  decryptedBody += cipher.final("utf-8");
  return JSON.parse(decryptedBody);
}

module.exports = { encrypt, decrypt };
 