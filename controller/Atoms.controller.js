const Atoms = require("../model/Atoms.model");
const { translate } = require("free-translate");
const wikipedia = require("../functions/wikipedia");
const getNest = require("../functions/getNest");
const isEmpty = require("../functions/isEmpty");
const { log } = require("../functions/logger");
const response = require("../functions/response");

const GetAll = async (req, res) => {
  try {
    let AllAtoms = await Atoms.find().sort({ number: 1 });

    if (!AllAtoms) {
      throw {
        status: 500,
        message: "database error",
      };
    }

    response({
      req,
      status: 200,
      action: "get all atoms",
      data: AllAtoms.map((prop) => ({
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
      })),
    })(res);
  } catch (e) {
    response({
      req,
      status: 500,
      action: "get all atoms",
      error: true,
      message: e?.errors || e,
    })(res);
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
      throw {
        message: "name is undefined",
      };
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
          Atom?.fa === undefined ||
          Object.values(Atom?.fa)
            .join("")
            .match(/null|object/g) !== null ||
          (query.refresh !== undefined && query.refresh == "true");
      }

      if (ShouldTranslate) {
        //Translating function:
        const Translating = new Promise((rs, rj) => {
          Object.keys(TranslateAtom).forEach(async (prop) => {
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
                  TranslateAtom.name = findTraName[
                    Object.keys(findTraName)[0]
                  ]?.langlinks?.find((obj) => obj.lang === query.translate)[
                    "*"
                  ];

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
                    throw null;
                  }

                  const source = `https://${
                    query.translate
                  }.wikipedia.com/w/index.php?curid=${
                    Object.keys(getNest(res.data, "query.pages"))[0]
                  }`;

                  TranslateAtom.source = source;
                }
              }
            } catch (e) {
              rj({
                status: 400,
                message: "'translate' query is incorrect",
              });
            }

            if (!Object.values(TranslateAtom).includes("")) {
              rs();
            }
          });
        });

        Translating.then(() => {
          const Retrun = {
            ...Atom._doc,
            [query.translate]: TranslateAtom,
          };

          //save to the DB:
          if (query.translate === "fa" && process.env.NODE_ENV !== "test") {
            Atom.fa = Retrun.fa;

            Atom.save().then(() => {
              log("translated added", "success");
            });
          }

          log(`translated to ${query.translate}`, "info");

          response({
            req,
            status: 200,
            action: `get ${Atom.name} atom`,
            data: Retrun,
          })(res);
        }).catch((e) => {
          response({
            req,
            error: true,
            action: `get atom`,
            status: e?.status || 500,
            message: e?.message || e,
          })(res);

          res.end();
        });
      } else {
        response({
          req,
          status: 200,
          action: `get ${Atom.name} atom`,
          data: Atom,
        })(res);
      }
    } else {
      response({
        req,
        status: 200,
        action: `get ${Atom.name} atom`,
        data: Atom,
      })(res);
    }
  } catch (e) {
    response({
      req,
      status: e?.status || 404,
      error: true,
      action: `get atom`,
      message: e?.message || e,
    })(res);
  }
};

const PostSearch = async (req, res) => {
  try {
    const { query, limit } = req.body;
    let AllAtoms;

    if (typeof query === "number") {
      AllAtoms = await Atoms.find({
        $or: [
          { number: query },
          { boil: query },
          { melt: query },
          { atomic_mass: query },
          { density: query },
        ],
      }).sort({ number: 1 });
    } else if (typeof query === "string") {
      AllAtoms = await Atoms.find({
        $or: [
          { name: new RegExp(query, "gi") },
          { category: new RegExp(query, "gi") },
          { phase: new RegExp(query, "gi") },
          { symbol: new RegExp(query, "gi") },
          { discovered_by: new RegExp(query, "gi") },
          { "fa.name": new RegExp(query, "gi") },
          { "fa.discovered_by": new RegExp(query, "gi") },
          { "fa.phase": new RegExp(query, "gi") },
          { "fa.category": new RegExp(query, "gi") },
        ],
      }).sort({ number: 1 });

      if (query === "transition" || query === "انتقالی") {
        AllAtoms = AllAtoms.filter(
          (atom) => !atom.category.includes("post-transition")
        );
      }
    } else {
      throw {
        status: 400,
        message: "query type isn't valid",
      };
    }

    if (!AllAtoms.length) {
      throw "Atom is undefined";
    } else {
      const OrgLength = AllAtoms.length;

      if (
        limit !== undefined &&
        !Number.isNaN(limit) &&
        limit < AllAtoms.length
      ) {
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

      response({
        req,
        status: 200,
        action: `find atom(s)`,
        data: {
          length: OrgLength,
          limit: !Number.isNaN(limit) ? +limit : undefined,
          results: [...AllAtoms],
        },
      })(res);
    }
  } catch (e) {
    response({
      req,
      status: e?.status || 404,
      error: true,
      action: `find atom(s)`,
      message: e?.message || e,
    })(res);
  }
};

module.exports = {
  GetSingle,
  GetAll,
  PostSearch,
};
