//manage errors:
function ManageErrors(res, arg) {
  if ((res?.passed) !== undefined) {
    res.passed = true;
    res.status(arg.status).json(arg);
  }
}

module.exports = ManageErrors;
