const Atoms = require("../model/Atoms.model");
const { translate } = require("free-translate");
const _ = require("lodash");

const GetAll = async (req, res) => {
  try {
    let AllAtoms = await Atoms.find().sort({ number: 1 });

    if (!AllAtoms) throw null;

    AllAtoms = AllAtoms.map((prop) => {
      return {
        id: prop._id,
        name: prop.name,
        category: prop.category,
        melt: prop.melt,
        boil: prop.boil,
        atomic_mass: prop.atomic_mass,
        number: prop.number,
        group: prop.group,
        period: prop.period,
        phase: prop.phase,
        symbol: prop.symbol,
        TranslatedName: prop.translate ? prop.translate.name : false,
        position: [prop.xpos, prop.ypos],
      };
    });

    res.json(AllAtoms);
  } catch (e) {
    ManageErrors(res, {
      method: "GET",
      status: 500,
      action: "Get all of the Atoms",
      params: req.params,
      error: e?.errors || e,
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

    let TranslateAtom = {};

    [
      "name",
      "appearance",
      "category",
      "discovered_by",
      "phase",
      "summary",
      "image.title",
    ].forEach((p) => {
      if (!_.isNull(_.at(Atom, p)[0])) TranslateAtom[p] = "";
    });

    if (
      _.isUndefined(Atom.translate) ||
      !_.isNull(
        Object.values(Atom.translate)
          .join("")
          .match(/null|object/g)
      )
    ) {
      const Translating = async (callback) => {
        try {
          await _.keys(TranslateAtom).forEach(async (prop) => {
            TranslateAtom[prop] = await translate(_.at(Atom, prop)[0], {
              to: "fa",
            });

            if (!_.values(TranslateAtom).includes("")) callback(null);
          });
        } catch (e) {
          callback(e);
        }
      };

      Translating((e) => {
        if (_.isNull(e)) {
          const Retrun = {
            ...Atom._doc,
            translate: TranslateAtom,
          };

          Atom.updateOne(Retrun).then(() => {
            console.log("translated added");
          });

          res.json(Retrun);
        }
      });
    } else {
      res.json(Atom);
    }
  } catch (e) {
    ManageErrors(res, {
      method: "GET",
      status: 404,
      action: "Get a single Atom",
      params: req.params,
      error: e?.errors || e,
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
