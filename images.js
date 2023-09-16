require("dotenv").config();
const { default: connect, connection } = require("./functions/connect");
const AtomsModel = require("./model/Atoms.model");
const path = require("path");
const fs = require("fs");
const { setting, log } = require("./functions/logger");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
}

setting({
  root: path.join(__dirname, "assets"),
  file: "download.log",
});

log(
  "You should not run this file with Iran IP; You can use VPN, DNS or other systems to change ip",
  "warn"
);

connect(process.env.MONGOURI)
  .then(() => {
    AtomsModel.find({ number: 1 })
      .then((Atoms) => {
        log("All atoms: " + Atoms.length, "debug");

        Atoms = Atoms.filter((Atom) => Atom.bohr_model_image !== null);

        const JsonFile = Atoms.map((Atom) => {
          return (
            !Atom.bohr_model_image.includes("localhost") && {
              id: Atom._id,
              name: Atom.name,
              number: Atom.number,
              bohr_model: Atom.bohr_model_image,
            }
          );
        });

        log("Valid atoms for download: " + JsonFile.length, "debug");

        const file = path.join("assets", "source", "bohr.json");

        if (fs.existsSync(file)) {
          const lastDatas = JSON.parse(fs.readFileSync(file, "utf-8"));

          fs.writeFileSync(file, JSON.stringify(lastDatas.concat(...JsonFile)));
        } else {
          fs.writeFileSync(file, JSON.stringify(JsonFile));
        }

        log("JSON file created", "success");

        setInterval(() => {
          log("-- Downloading...", "debug");
        }, 10000);

        return Atoms;
      })
      .then((Atoms) => {
        Atoms.forEach((Atom, i) => {
          const folder = path.join("./assets", "bohr/");
          const image = Atom.bohr_model_image;
          const extension = image.slice(image.lastIndexOf("."));
          const fileName = Atom.name + extension;

          const download = async () => {
            try {
              await sleep(90);

              const responseBuffer = await (
                await (
                  await fetch(image + `?i=${Date.now() * Math.random()}`)
                ).blob()
              ).arrayBuffer();

              await sleep(90);

              fs.writeFileSync(
                path.join(folder, fileName),
                Buffer.from(responseBuffer)
              );

              const uploadedPath =
                "/" + path.join(folder, fileName).replaceAll("\\", "/");

              Atom.bohr_model_image = uploadedPath;

              // Atom.save().then(async () => {
              // });
            } catch (error) {
              throw new Error(`${error.message}\n-> ${Atom.bohr_model_image}`);
            }
          };

          const check = async () => {
            if (
              !fs.existsSync(path.join(folder, fileName)) ||
              !Atom.bohr_model_image.includes("assets")
            ) {
              await download();
            } else {
              log(Atom.name + " is the same to saved datas", "info");
            }

            if (i === Atoms.length - 1) {
              log("Images downloaded", "success");
              connection.close();
              process.exit(1);
            }
          };

          check();
        });
      });
  })
  .catch((e) => {
    log(e, "error");
  });
