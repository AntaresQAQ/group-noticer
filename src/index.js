const fs = require("fs");

global.ErrorMsg = class ErrorMsg {
  constructor(info, retcode) {
    this.info = info;
    this.retcode = retcode;
  }

  toString() {
    return `${this.info}, retcode=${this.retcode}`;
  }
}

class GroupNoticer {
  static loadConfig() {
    const path = require("path"), yaml = require("js-yaml");
    const file_path = path.join(__dirname, "../config.yaml");
    if (!fs.existsSync(file_path)) {
      fs.copyFileSync(path.join(__dirname, "../config-example.yaml"), file_path);
    }
    const config = yaml.safeLoad(fs.readFileSync(file_path).toString());
    if (!config.security.secret || !config.cqhttp.token || !config.cqhttp.group_id ||
      (!config.server.socket && (!config.server.hostname || !config.server.port))) {
      console.error('Please Complete the Configuration File "config.yaml" First!');
      process.exit(1);
    }
    return config;
  }

  static loadHooks(security) {
    const BodyParser = require("body-parser");
    app.use(BodyParser.urlencoded({
      extended: true,
      limit: "50mb"
    }));
    app.use(BodyParser.json({limit: "50mb"}));

    app.server = require("http").createServer(app);

    const token = require("./utility.js").md5(security.secret);
    app.use((req, res, next) => {
      if (req.query.token !== token) {
        logger.info(`Authentication failed: token=${req.query.token}`);
        res.status(403).send({code: 403, msg: "Permission error"});
        return;
      }
      next();
    });
  }

  static listen(server) {
    if (server.socket) {
      fs.stat(server.socket, (err) => {
        if (!err) fs.unlinkSync(server.socket);
        app.server.listen(server.socket, () => {
          fs.chmodSync(server.socket, "777");
          logger.info(`App is listening on ${server.socket}...`);
        });
      });
    } else {
      app.server.listen(server.port, server.hostname, () => {
        logger.info(`App is listening on ${server.hostname}:${server.port}...`);
      });
    }
  }

  static async run() {
    const config = this.loadConfig();

    const Logger = require('./logger.js');
    const CQHttp = require('./cqhttp.js');

    global.logger = new Logger(config.log_level);

    global.bot = new CQHttp(
      config.cqhttp.server,
      config.cqhttp.token,
      config.cqhttp.group_id
    );

    global.app = require("express")();

    this.loadHooks(config.security);

    require("./api.js");

    this.listen(config.server);
  }
}

module.exports = GroupNoticer;