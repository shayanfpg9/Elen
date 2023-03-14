const Atoms = require("../model/Atoms.model");
const { translate } = require("free-translate");
const _ = require("lodash");

const GetAll = async (req, res) => {
  try {
    let AllAtoms = await Atoms.find().sort({ number: 1 });

    if (!AllAtoms) {
      throw null;
    }

    AllAtoms = AllAtoms.map((prop) => {
      //filter submissions:
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
  const query = req.query;

  try {
    const Atom = (
      await Atoms.find({
        name: req.params.name[0].toUpperCase() + req.params.name.slice(1),
      })
    )[0];

    if (!_.isUndefined(query?.translate)) {
      //Obj for translation properties:
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
        if (!_.isNull(_.at(Atom, p)[0])) {
          TranslateAtom[p] = "";
        }
      });

      if (
        //checking the existence of translation in database for this atom:
        _.isUndefined(Atom?.fa) ||
        !_.isNull(
          Object.values(Atom.fa)
            .join("")
            .match(/null|object/g)
        )
      ) {
        //Translating function:
        const Translating = async (callback) => {
          try {
            await _.keys(TranslateAtom).forEach(async (prop) => {
              TranslateAtom[prop] = await translate(_.at(Atom, prop)[0], {
                to: query.translate,
              });

              if (!_.values(TranslateAtom).includes("")) {
                callback(null);
              }
            });
          } catch (e) {
            callback(e);
          }
        };

        Translating((e) => {
          if (_.isNull(e)) {
            const Retrun = {
              ...Atom._doc,
              [query.translate]: TranslateAtom,
            };

            //save to the DB:
            if (query.translate === "fa") {
              Atom.updateOne(Retrun).then(() => {
                /* eslint no-console: 0 */
                console.log("translated added");
              });
            }

            res.json(Retrun);
          }
        });
      } else {
        res.json(Atom);
      }
    } else {
      if (!_.isUndefined(Atom?.fa)) {
        const WithoutTranslate = _.keys(Atom).map((k) => {
          if (k !== "fa") {
            return Atom[k];
          } else {
            return null;
          }
        });

        res.json(WithoutTranslate);
      } else {
        res.json(Atom);
      }
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

//manage errors:
function ManageErrors(res, arg) {
  res.status(arg.status).json(arg);
}

module.exports = {
  GetSingle,
  GetAll,
};
