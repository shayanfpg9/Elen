const _ = require("lodash");
const path = require("path");
const ManageErrors = require("../functions/errors");

const GetLang = (req, res) => {
  try {
    const { lang } = req.params;
    if (!_.includes(["fa", "en"], lang)) {
      ManageErrors(res, {
        method: "GET",
        status: 406,
        action: "Get languages",
        params: req.params,
        error: "language code is not supported",
      });
    }

    res.sendFile(`${lang}.json`, {
      root: path.join(__dirname, "../langs"),
    });
  } catch (e) {
    ManageErrors(res, {
      method: "GET",
      status: 500,
      action: "Get languages",
      params: req.params,
      error: e?.errors || e,
    });
  }
};

module.exports = { GetLang };
