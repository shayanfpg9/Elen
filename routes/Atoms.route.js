const express = require("express"),
  router = express.Router(),
  Atoms = require("../model/Atoms.model");

//--------------------------------------------------------> Get

//router / Get -- All
router.get("/", async (req, res) => {
  try {
    const AllAtoms = await Atoms.find().sort({ number: 1 });

    if (!AllAtoms) throw null;

    res.json(AllAtoms);
  } catch (e) {
    console.error(e.errors || e);
  }
});

//router / GET -- Single
router.get("/:name", async (req, res) => {
  const Atom = await Atoms.find({
    name: req.params.name[0].toUpperCase() + req.params.name.slice(1),
  });

  res.json(Atom);
});

module.exports = router;
