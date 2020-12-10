const moment = require("moment");
require("colors");

class Logger {
  constructor(level) {
    level = (level || "info").toLowerCase();
    if (level === "debug") {
      this.debug_on = true;
      this.info_on = true;
      this.warning_on = true;
      this.error_on = true;
    } else if (level === "info") {
      this.info_on = true;
      this.warning_on = true;
      this.error_on = true;
    } else if (level === "warning") {
      this.warning_on = true;
      this.error_on = true;
    } else if (level === "error") {
      this.error_on = true;
    }
  }

  print_log(msg, level) {
    msg = `[${moment().format("YYYY-MM-DD HH:mm:ss")}][${level.toUpperCase()}]: ${msg}`;
    if (level === "debug") {
      msg = msg.white;
    } else if (level === "info") {
      msg = msg.green;
    } else if (level === "warning") {
      msg = msg.yellow;
    } else if (level === "error") {
      msg = msg.red;
    }
    console.log(msg);
  }

  debug(msg) {
    if (this.debug_on) {
      this.print_log(msg, "debug");
    }
  }

  info(msg) {
    if (this.info_on) {
      this.print_log(msg, "info");
    }
  }

  warning(msg) {
    if (this.warning_on) {
      this.print_log(msg, "warning");
    }
  }

  error(msg) {
    if (this.error_on) {
      this.print_log(msg, "error");
    }
  }
}

module.exports = Logger;