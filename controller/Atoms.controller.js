const Atoms = require("../model/Atoms.model");
const { translate } = require("free-translate");
const wikipedia = require("../functions/wikipedia");
const ManageErrors = require("../functions/errors");
const _ = require("lodash")
const getNest = require("../functions/getNest");
const isEmpty = require("../functions/isEmpty");

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

    if (!Atom) {
      throw "Atom name is incorrect";
    } else if (query?.translate !== undefined) {
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
        if (getNest(Atom, p) !== null) {
          TranslateAtom[p] = "";
        }
      });

      let ShouldTranslate = query.translate !== "en";

      if (query.translate === "fa") {
        //checking the existence of translation in database for this atom:
        ShouldTranslate =
          (Atom?.fa) === undefined ||
          (
            Object.values(Atom?.fa)
              .join("")
              .match(/null|object/g)
          ) !== null ||
          ((query.refresh) !== undefined && query.refresh == "true");
      }

      if (ShouldTranslate) {
        //Translating function:
        const Translating = async (callback) => {
          await Object.keys(TranslateAtom).forEach(async (prop) => {
            try {
              if (isEmpty(TranslateAtom[prop])) {
                if (!["name", "source"].includes(prop)) {
                  TranslateAtom[prop] = await translate(getNest(Atom, prop), {
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

                  //the translated name in google translate has some spelling or meaning problems
                  TranslateAtom.name = findTraName[Object.keys(findTraName)[0]]?.langlinks?.find((obj) => (obj.lang === query.translate))["*"]

                  const res = await wikipedia(
                    {
                      action: "query",
                      titles: TranslateAtom.name,
                      prop: "langlinks",
                      lllimit: 500,
                      format: "json",
                    },
                    query.translate
                  );

                  if (res.status !== 200) {
                    throw "'translate' parameter is incorrect";
                  }

                  const source = `https://${query.translate
                    }.wikipedia.com/w/index.php?curid=${Object.keys(getNest(res.data, "query.pages"))[0]
                    }`;

                  TranslateAtom.source = source;
                }
              }
            } catch (e) {
              callback(e);
            }

            if (!Object.values(TranslateAtom).includes("")) {
              callback(null);
            }
          });
        };

        Translating((e) => {
          if (e === null) {
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

            res.status(200).json(Retrun);
          } else {
            ManageErrors(res, {
              method: "GET",
              status: 400,
              action: "Get a single Atom",
              params: req.params,
              query,
              error: e?.errors || e,
            });
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
      query,
      error: e?.errors || e,
    });

    res.end()
  }
};

const PostSearch = async (req, res) => {
  try {
    const { q } = req.body;
    const { limit } = req.query;
    let AllAtoms;

    if (typeof q === "number") {
      AllAtoms = await Atoms.find({
        $or: [
          { number: q },
          { boil: q },
          { melt: q },
          { atomic_mass: q },
          { density: q },
        ],
      }).sort({ number: 1 });
    } else if (typeof q === "string") {
      AllAtoms = await Atoms.find({
        $or: [
          { name: new RegExp(q, "gi") },
          { category: new RegExp(q, "gi") },
          { phase: new RegExp(q, "gi") },
          { symbol: new RegExp(q, "gi") },
          { discovered_by: new RegExp(q, "gi") },
          { "fa.name": new RegExp(q, "gi") },
          { "fa.discovered_by": new RegExp(q, "gi") },
          { "fa.phase": new RegExp(q, "gi") },
          { "fa.category": new RegExp(q, "gi") },
        ],
      }).sort({ number: 1 });

      if (q === "transition" || q === "انتقالی") {
        AllAtoms = AllAtoms.filter(
          (atom) => !atom.category.includes("post-transition")
        );
      }
    } else {
      throw "query type isn't valid"
    }

    if (!AllAtoms.length) {
      throw "Atom is undefined or not translated to this language";
    } else {
      const OrgLength = AllAtoms.length;

      if (limit !== undefined && limit !== NaN && limit < AllAtoms.length) {
        AllAtoms = AllAtoms.slice(0, +limit);
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


      res.json({
        length: OrgLength,
        limit: limit !== NaN ? +limit : undefined,
        results: [...AllAtoms],
      });
    }
  } catch (e) {
    ManageErrors(res, {
      method: "POST",
      status: 404,
      action: "Search to find atom",
      body: req.body,
      query: req.query,
      params: req.params,
      error: e?.errors || e,
    });
  }
};

module.exports = {
  GetSingle,
  GetAll,
  PostSearch,
};
