const Atoms = require("../model/Atoms.model");
const { translate } = require("free-translate");
const _ = require("lodash");
const wikipedia = require("../functions/wikipedia");

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
        "source",
      ].forEach((p) => {
        if (!_.isNull(_.at(Atom, p)[0])) {
          TranslateAtom[p] = "";
        }
      });

      let ShouldTranslate = true;

      if (query.translate === "fa") {
        //checking the existence of translation in database for this atom:
        ShouldTranslate =
          _.isUndefined(Atom?.fa) ||
          !_.isNull(
            Object.values(Atom?.fa)
              .join("")
              .match(/null|object/g)
          ) ||
          (!_.isUndefined(query.refresh) && query.refresh);
      }

      if (ShouldTranslate) {
        //Translating function:
        const Translating = async (callback) => {
          try {
            await _.keys(TranslateAtom).forEach(async (prop) => {
              if (
                !_.includes(["name", "source"], prop) &&
                _.isEmpty(TranslateAtom[prop])
              ) {
                TranslateAtom[prop] = await translate(_.at(Atom, prop)[0], {
                  to: query.translate,
                });
              } else {
                const findTraName = (
                  await wikipedia(
                    {
                      action: "query",
                      titles: Atom.name,
                      prop: "langlinks",
                      lllimit: 500,
                      format: "json",
                    },
                    "en"
                  )
                ).data.query.pages;

                findTraName[_.keys(findTraName)[0]]?.langlinks?.forEach(
                  (obj) => {
                    if (obj.lang === query.translate) {
                      //the translated name in google translate has some spelling or meaning problems
                      TranslateAtom.name = obj["*"];
                    }
                  }
                );

                const { data } = await wikipedia(
                  {
                    action: "query",
                    titles: TranslateAtom.name,
                    prop: "langlinks",
                    lllimit: 500,
                    format: "json",
                  },
                  query.translate
                );

                const source = `https://${
                  query.translate
                }.wikipedia.com/w/index.php?curid=${
                  _.keys(_.at(data, "query.pages")[0])[0]
                }`;

                TranslateAtom.source = source;
              }

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
            /* eslint no-console: 0 */
            console.log(`translated to ${query.translate}`);

            res.json(Retrun);
          }
        });
      } else {
        res.json(Atom);
      }
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

//manage errors:
function ManageErrors(res, arg) {
  res.status(arg.status).json(arg);
}

module.exports = {
  GetSingle,
  GetAll,
};
