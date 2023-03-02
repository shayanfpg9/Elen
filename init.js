require("dotenv").config();
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const connect = require("./functions/connect");
const Atoms = require("./model/Atoms.model");

console.log("Please delete all of the datas before run this file...");

fs.readFile("./init/periodic-table.json", "utf-8", (err, json) => {
  if (err) console.log(err);
  const { elements } = JSON.parse(json);

  console.log(`we're have ${elements.length} items in the JSON file`);

  connect(process.env.MONGOURI)
    .then(() => {
      try {
        Atoms.create(elements).finally(async () => {
          console.log(`${(await Atoms.find()).length} items added`);

          mongoose.connection.close().finally(() => {
            console.log("Database closed");
          });
        });
      } catch (e) {
        throw e;
      }
    })
    .catch((e) => {
      console.error(e.reason || e);
      console.log("Database closed");
    });
});
