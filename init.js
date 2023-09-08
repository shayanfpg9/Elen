require("dotenv").config();
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const connect = require("./functions/connect");
const Atoms = require("./model/Atoms.model");

fs.readFile("./init/periodic-table.json", "utf-8", (err, json) => {
  if (err) console.log(err);
  const { elements } = JSON.parse(json);

  console.log(`we're have ${elements.length} items in the JSON file`);

  connect(process.env.MONGOURI)
    .then(async () => {
      try {
        await Atoms.deleteMany({})
        await Atoms.create(elements).finally()

        console.log(`${(await Atoms.find()).length} items added`);

        mongoose.connection.close().finally(() => {
          console.log("Database closed");
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
