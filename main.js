const BodyParser = require("body-parser");
const Express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const yaml = require("js-yaml");

class GroupNoticer {
  static loadConfig() {
    const file_path = path.join(__dirname, "config.yaml");
    if (!fs.existsSync(file_path)) {
      fs.copyFileSync(path.join(__dirname, "config-example.yaml"), file_path);
    }
    global.config = yaml.safeLoad(fs.readFileSync(file_path).toString());
  }

  static loadHooks() {
    const token = require("./utility.js").md5(global.config.security.secret);
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
    this.loadConfig();
    const CQHttp = require('./cqhttp.js');
    global.bot = new CQHttp(
      config.cqhttp.server,
      config.cqhttp.token,
      config.cqhttp.group_id
    );
    global.app = Express();
    app.use(BodyParser.urlencoded({
      extended: true,
      limit: "50mb"
    }));
    app.use(BodyParser.json({limit: "50mb"}));
    app.server = http.createServer(app);
    this.loadHooks();
    this.loadApi();
    app.server.listen(config.server.port, config.server.hostname, () => {
      console.log(`App is listening on ${config.server.hostname}:${config.server.port}...`);
    });
  }
}

GroupNoticer.run().catch(console.error);