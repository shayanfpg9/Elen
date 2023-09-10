/* eslint no-console: 0 */ // --> OFF
const logger = require("node-color-log");
const fs = require("fs");
const path = require("path");

function set_setting(props) {
  console.setting = {
    root: props?.root !== undefined ? props.root : __dirname,
    file: props?.file !== undefined ? props.file : "app.log",
    save: props?.save !== undefined ? props.save : true,
    clear: props?.clear !== undefined ? props.clear : false,
  };

  return console.setting;
}

async function log_action(data, status = "success", props) {
  let { save, clear } = props || {};
  if (save === undefined) {
    save = console.setting.save;
  }

  if (clear === undefined) {
    clear = console.setting.clear;
  }

  let { msg, file } = data;

  if (typeof data == "string") {
    msg = data;
    file = undefined;
  }

  const LogFileName = console.setting.file;
  const logFile = path.join(console.setting.root, LogFileName);
  const code = Date.now();

  if (typeof msg == "string") {
    msg = msg.replace(/%FILE%/gim, logFile);
  }

  if (clear && (await fs.existsSync(logFile))) {
    await fs.unlinkSync(logFile, "");
  }

  if (!status.match(/#NoLog/gi)) {
    logger[status](
      (save ? `-> ${LogFileName}#${code}\t` : "").toUpperCase() + msg
    );
  } else {
    status = status.replace(/#NoLog/gi, "").trim();

    if (status === "") {
      status = "log";
    }
  }

  try {
    !(save && (await fs.readFileSync(logFile)));
  } catch (error) {
    await fs.writeFileSync(logFile, "");
  }

  if (save && status !== "log") {
    status = status.charAt(0).toUpperCase() + status.slice(1);

    const PathFile = file;

    const text = `--> #${code} Log [${status}]:\nFrom "${
      PathFile ? PathFile : "Anonymous"
    }" file at ${new Date().toDateString()}\nMessage: ${msg}\n\n`;

    await fs[!clear ? "appendFileSync" : "writeFileSync"](logFile, text);
  }
}

function clear_log(log = true, save = false) {
  console.clear();

  log_action(
    {
      msg: `the "%FILE%" file is completely empty`,
      file: __filename,
    },
    log ? "warn" : "#NoLog",
    { save, clear: true }
  );
}

(() => {
  set_setting();
})();

module.exports = {
  log: log_action,
  clear: clear_log,
  setting: set_setting,
};
