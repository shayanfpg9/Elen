const Atoms = require("../model/Atoms.model");

const GetAll = async (req, res) => {
  try {
    const AllAtoms = await Atoms.find().sort({ number: 1 });

    if (!AllAtoms) throw null;

    res.json(AllAtoms);
  } catch (e) {
    res.status(500).json({
      method: "GET",
      action: "Get all of the Atoms",
      params: req.params,
      error: e.errors || e,
    });
  }
};

const GetSingle = async (req, res) => {
  try {
    const Atom = await Atoms.find({
      name: req.params.name[0].toUpperCase() + req.params.name.slice(1),
    });

    res.json(Atom);
  } catch (e) {
    res.status(404).json({
      method: "GET",
      action: "Get a single Atom",
      params: req.params,
      error: e.errors || e,
    });
  }
};

module.exports = {
  GetSingle,
  GetAll,
};
