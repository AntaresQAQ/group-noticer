const axios = require("axios");

class CQHttp {
  constructor(host, token, group_id) {
    this.host = host;
    this.token = token;
    this.group_id = group_id;
  }

  async post(action, post_data) {
    const headers = {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}
    const uri = new URL(action, this.host).href;
    const {data} = await axios.post(uri, post_data, {headers});
    return data;
  }

  async getGroupMemberList() {
    const res = await this.post("get_group_member_list", {
      group_id: this.group_id
    });
    if (res.status === 'failed') throw new Error("failed to get, retcode=" + res.retcode);
    return res.data;
  }

  async sendGroupMessage(message, auto_escape = false) {
    const res = await this.post("send_group_msg", {
      group_id: this.group_id,
      message,
      auto_escape
    });
    if (res.status === 'failed') throw new Error("failed to send, retcode=" + res.retcode);
    return res.data.message_id;
  }

  async sendGroupNotice(title, content) {
    const res = await this.post("_send_group_notice", {
      group_id: this.group_id,
      title, content
    });
    if (res.status === 'failed') throw new Error("failed to send, retcode=" + res.retcode);
  }

  async deleteMessage(message_id) {
    const res = await this.post("delete_msg", {
      message_id
    });
    if (res.status === 'failed') throw new Error("failed to delete, retcode=" + res.retcode);
  }
}


module.exports = CQHttp;