
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