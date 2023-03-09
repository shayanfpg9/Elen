const Atoms = require("../model/Atoms.model");

const GetAll = async (req, res) => {
  try {
    const AllAtoms = await Atoms.find().sort({ number: 1 });

    if (!AllAtoms) throw null;

    res.json(AllAtoms);
  } catch (e) {
    ManageErrors(res, {
      method: "GET",
      status: 500,
      action: "Get all of the Atoms",
      params: req.params,
      error: e.errors || e,
    });
  }
};

const GetSingle = async (req, res) => {
  try {
    const Atom = (
      await Atoms.find({
        name: req.params.name[0].toUpperCase() + req.params.name.slice(1),
      })
    )[0];

    res.json(Atom);
  } catch (e) {
    ManageErrors(res, {
      method: "GET",
      status: 404,
      action: "Get a single Atom",
      params: req.params,
      error: e.errors || e,
    });
  }
};

function ManageErrors(res, arg) {
  res.status(arg.status).json(arg);
}

module.exports = {
  GetSingle,
  GetAll,
};
