class GroupNoticer {
  static loadConfig() {
    const fs = require("fs"), path = require("path"), yaml = require("js-yaml");
    const file_path = path.join(__dirname, "../config.yaml");
    if (!fs.existsSync(file_path)) {
      fs.copyFileSync(path.join(__dirname, "../config-example.yaml"), file_path);
    }
    return yaml.safeLoad(fs.readFileSync(file_path).toString());
  }

  static loadHooks(config) {
    const BodyParser = require("body-parser");
    app.use(BodyParser.urlencoded({
      extended: true,
      limit: "50mb"
    }));
    app.use(BodyParser.json({limit: "50mb"}));

    app.server = require("http").createServer(app);

    const token = require("./utility.js").md5(config.security.secret);
    app.use((req, res, next) => {
      if (req.query.token !== token) {
        res.send({code: 403, msg: "Permission error"});
        return;
      }
      next();
    });
  }

  static loadApi() {
    require("./api_post.js");
    require("./api_get.js");
  }

  static async run() {
    const config = this.loadConfig();
    const CQHttp = require('./cqhttp.js');
    global.bot = new CQHttp(
      config.cqhttp.server,
      config.cqhttp.token,
      config.cqhttp.group_id
    );

    global.app = require("express")();

    this.loadHooks(config);
    this.loadApi();

    app.server.listen(config.server.port, config.server.hostname, () => {
      console.log(`App is listening on ${config.server.hostname}:${config.server.port}...`);
    });
  }
}

module.exports = GroupNoticer;