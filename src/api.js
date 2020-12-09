const Utility = require("./utility.js");

app.post("/send_message", async (req, res) => {
  try {
    let message = Utility.escapeCQCode(req.body.message);
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
    res.send({
      code: 200,
      msg: "ok",
      message_id
    });
  } catch (e) {
    console.log(e);
    res.send({code: 500, msg: e.toString()});
  }
});

app.post("/send_image", async (req, res) => {
  try {
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
    let message = `[CQ:image,file=${file}]`;
    const message_id = await bot.sendGroupMessage(message);
    res.send({
      code: 200,
      msg: "ok",
      message_id
    });
  } catch (e) {
    console.log(e);
    res.send({code: 500, msg: e.toString()});
  }
});

app.post("/send_link", async (req, res) => {
  try {
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
    res.send({
      code: 200,
      msg: "ok",
      message_id
    });
  } catch (e) {
    console.log(e);
    res.send({code: 500, msg: e.toString()});
  }
});

app.post("/send_notice", async (req, res) => {
  try {
    let {title, content} = req.body;
    await bot.sendGroupNotice(title, content);
    res.send({code: 200, msg: "ok"});
  } catch (e) {
    console.log(e);
    res.send({code: 500, msg: e.toString()});
  }
});

app.post("/delete_message", async (req, res) => {
  try {
    await bot.deleteMessage(req.body.message_id);
    res.send({code: 200, msg: "ok"});
  } catch (e) {
    console.log(e);
    res.send({code: 500, msg: e.toString()});
  }
});

app.get("/get_members", async (req, res) => {
  try {
    let members = await bot.getGroupMemberList();
    res.send({
      code: 200,
      msg: "ok",
      members
    });
  } catch (e) {
    console.log(e);
    res.send({code: 500, msg: e.toString()});
  }
});

