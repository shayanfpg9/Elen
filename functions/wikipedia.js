const _ = require("lodash");
const axios = require("axios");

async function wikipedia(options, lang = "en") {
  const url = `https://${lang}.wikipedia.org/w/api.php`;
  const query = [];

  _.keys(options).forEach((k, i) => {
    query.push(`${i === 0 ? "?" : "&"}${k}=${options[k]}`);
  });

  try {
    return await axios.get(url + query.join(""));
  } catch (e) {
    return undefined;
  }
}

module.exports = wikipedia;
