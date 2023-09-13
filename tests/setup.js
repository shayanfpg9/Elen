require("dotenv").config();
const { default: connect, connection } = require("../functions/connect");
const { setting } = require("../functions/logger");

setting({
  save: false,
});

// Listen:
connect(process.env.MONGOURI).catch((e) => {
  // eslint-disable-next-line  no-console
  console.error(e);
  connection.close();
  process.exit(1);
});
