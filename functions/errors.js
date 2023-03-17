const _ = require("lodash");

//manage errors:
function ManageErrors(res, arg) {
  if (_.isUndefined(res?.passed)) {
    res.passed = true;
    res.status(arg.status).json(arg);
  }
}

module.exports = ManageErrors;
