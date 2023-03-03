const express = require("express"),
  router = express.Router(),
  Atoms = require("../model/Atoms.model");

//--------------------------------------------------------> Export

//router / export -- All
router.get("/export", (req, res) => {
  res.json({
    lang: "router",
    method: "GET",
    action: "Export all of the Atoms",
  });
});

//router / export -- Single
router.get("/export/:id", (req, res) => {
  res.json({
    lang: "router",
    method: "GET",
    action: "Export a single Atom",
    params: req.params,
  });
});

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
