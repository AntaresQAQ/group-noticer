const CryptoJS = require("crypto-js");
const util = require("util");

class Utility {
  static md5(message) {
    return CryptoJS.MD5(message).toString();
  }

  static encryptAES(message, secret) {
    return CryptoJS.AES.encrypt(message, secret);
  }

  static decryptAES(encryptedMessage, secret) {
    return CryptoJS.AES.decrypt(encryptedMessage, secret);
  }

  static escapeCQCode(text, is_value = false) {
    if (is_value) text = text.replace(/,/g, "&#44;");
    return text.replace(/&/g, "&amp;")
      .replace(/\[/g, "&#91;")
      .replace(/]/g, "&#93;");
  }

  static unescapeCQCode(text, is_value = false) {
    if (is_value) text = text.replace(/&#44;/g, ",");
    return text.replace(/&amp;/g, "&")
      .replace(/&#91;/g, "[")
      .replace(/&#93;/g, "]");
  }

  static inspect(obj) {
    return util.inspect(obj);
  }

  static log(obj) {
    if (obj instanceof ErrorMsg) {
      logger.warning(this.inspect(obj));
    } else {
      logger.error(obj);
    }
  }
}

module.exports = Utility;