require("dotenv").config();
const { default: connect, connection } = require("./functions/connect");
const app = require("./app");
const { setting, log } = require("./functions/logger");

// Listen:
setting({
  save: false,
});

connect(process.env.MONGOURI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      log(`listening on port ${process.env.PORT}`, "success");
    });
  })
  .catch((e) => {
    log(e, "error");
    connection.close();
    process.exit(1);
  });
