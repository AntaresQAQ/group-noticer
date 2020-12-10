const {escapeCQCode, inspect} = require("./utility.js");

app.post("/send_message", async (req, res) => {
  try {
    logger.debug(`send_message: body\n${inspect(req.body)}`);
    let message = escapeCQCode(req.body.message);
    const at = req.body.at;
    if (at) {
      if (at === 'all') {
        message = `[CQ:at,qq=all]\n${message}`;
      } else if (typeof at === "object") {
        at.forEach(value => message += `\n[CQ:at,qq=${value}]`);
      } else {
        message = `[CQ:at,qq=${at}]\n${message}`;
      }
    }
    let message_id = await bot.sendGroupMessage(message);
    logger.info(`send_message: ${message} id=${message_id}`);
    res.send({
      code: 200,
      msg: "ok",
      message_id
    });
  } catch (e) {
    GroupNoticer.log(e);
    res.send({code: 500, msg: e});
  }
});

app.post("/send_image", async (req, res) => {
  try {
    logger.debug(`send_image: body\n${inspect(req.body)}`);
    let {file, type} = req.body;
    if (type === "url") {
    } else if (type === "base64") {
      file = "base64://" + file;
    } else {
      res.send({
        code: 501,
        msg: "unknown type"
      });
      return;
    }
    const message = `[CQ:image,file=${file}]`;
    const message_id = await bot.sendGroupMessage(message);
    logger.info(`send_image: ${message} id=${message_id}`);
    res.send({
      code: 200,
      msg: "ok",
      message_id
    });
  } catch (e) {
    GroupNoticer.log(e);
    res.send({code: 500, msg: e});
  }
});

app.post("/send_link", async (req, res) => {
  try {
    logger.debug(`send_link: body\n${inspect(req.body)}`);
    const {url, title, content, image} = req.body;
    let message = `[CQ:share,url=${url},title=${title}`;
    if (content) {
      message = message + `,content=${content}`;
    }
    if (image) {
      message = message + `,image=${image}`
    }
    message = message + "]";
    const message_id = await bot.sendGroupMessage(message);
    logger.info(`send_link: ${message} id=${message_id}`);
    res.send({
      code: 200,
      msg: "ok",
      message_id
    });
  } catch (e) {
    GroupNoticer.log(e);
    res.send({code: 500, msg: e});
  }
});

app.post("/send_poke", async (req, res) => {
  try {
    logger.debug(`send_poke: body\n${inspect(req.body)}`);
    const user_id = req.body.user_id;
    await bot.sendGroupMessage(`[CQ:poke,qq=${user_id}]`);
    logger.info(`send_poke: user_id=${user_id}`);
    res.send({code: 200, msg: "ok"});
  } catch (e) {
    GroupNoticer.log(e);
    res.send({code: 500, msg: e});
  }
});

app.post("/send_notice", async (req, res) => {
  try {
    logger.debug(`send_notice: body\n${inspect(req.body)}`);
    const {title, content} = req.body;
    await bot.sendGroupNotice(title, content);
    logger.info(`send_notice: title=${title} content=${content}`);
    res.send({code: 200, msg: "ok"});
  } catch (e) {
    GroupNoticer.log(e);
    res.send({code: 500, msg: e});
  }
});

app.post("/delete_message", async (req, res) => {
  try {
    logger.debug(`delete_message: body\n${inspect(req.body)}`);
    await bot.deleteMessage(req.body.message_id);
    logger.info(`delete_message: message_id=${req.body.message_id}`);
    res.send({code: 200, msg: "ok"});
  } catch (e) {
    GroupNoticer.log(e);
    res.send({code: 500, msg: e.toString()});
  }
});

app.get("/get_members", async (req, res) => {
  try {
    let members = await bot.getGroupMemberList();
    logger.info("get_members");
    res.send({
      code: 200,
      msg: "ok",
      members
    });
  } catch (e) {
    GroupNoticer.log(e);
    res.send({code: 500, msg: e});
  }
});

