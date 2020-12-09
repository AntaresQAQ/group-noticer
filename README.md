# group-noticer
QQ群通知器

## 运行

环境: Node.js 12+

```bash
yarn
node run.js
```

编辑配置文件`config.yaml`。

```yaml
cqhttp:
  server: http://127.0.0.1:5700 # cqhttp监听端口
  token: # cqhttp的token
  group_id: # 你要进行通知的群号

server:
  socket: /dev/shm/group-noticer.sock # 如果需要监听端口删除这行
  hostname: 127.0.0.1 # 监听地址
  port: 8380 # 监听端口

security:
  secret: # 用于认证身份的密码，必填
```

编辑后，运行: 

```bash
node run.js
```

## 认证

服务端保存了用于身份认证的密码。

访问API时，请在query中包含: 

- token: 身份认证密码的md5值

token不正确的访问会返回403错误和以下信息: 

```json
{
  "code": 403,
  "msg": "Permission error"
}
```

## API

### /send_message

- 功能: 在群内发送一条普通消息

- method: POST

- body: 

  - message: string，消息内容
  - at: array或string，可以为QQ号列表或`all`，指定@某些人或者全体成员。（可选）

  ```json
  {
    "message":"test1",
    "at": [12345678,99999999]
  }
  ```

  ```json
  {
    "message":"test2",
    "at": "all"
  }
  ```

- response: 

  - code: number，状态码，200为成功，其他为失败
  - msg: string，信息，`ok`为成功，其他为错误信息
  - message_id: number，消息的唯一ID，仅在成功时返回

  ```json
  {
    "code": 200,
    "msg": "ok",
    "message_id": 1571894899
  }
  ```

### /send_image

- 功能: 在群内发送一张图片

- method: POST

- body: 

  - file: string，一个链接或者base64字符串
  - type: string，可以为`url`或`base64`，表示类型。

  ```json
  {
    "file":"https://gravatar.loli.net/avatar/649f1cd6d3db1f339314c2575c9ab163?s=1024",
    "type":"url"
  }
  ```

  ```json
  {
    "file":"/9j/4AAQSkZ...",
    "type":"base64"
  }
  ```

- response: 

  - code: number，状态码，200为成功，其他为失败
  - msg: string，信息，`ok`为成功，其他为错误信息
  - message_id: number，消息的唯一ID，仅在成功时返回

  ```json
  {
    "code": 200,
    "msg": "ok",
    "message_id": 1654281275
  }
  ```

### /send_link

- 功能: 在群内发送一个链接分享

- method: POST

- body: 

  - url: string，分享的链接
  - title: string，标题
  - content: string，内容说明（可选）
  - image: string，链接图片，可以是url或者以`base64://`开头的字符串。（可选）

  ```json
  {
      "url":"https://github.com/AntaresQAQ/group-noticer",
      "title":"group-noticer",
      "content":"AntaresQAQ/group-noticer: QQ群通知器",
      "image":"https://github.com/fluidicon.png"
  }
  ```

- response: 

  - code: number，状态码，200为成功，其他为失败
  - msg: string，信息，`ok`为成功，其他为错误信息
  - message_id: number，消息的唯一ID，仅在成功时返回

  ```json
  {
    "code": 200,
    "msg": "ok",
    "message_id": -1830633393
  }
  ```

### /send_notice

- 功能: 发送群通知

- method: POST

- body: 

  - title: string，标题
  - content: string，内容

  ```json
  {
      "title":"通知测试",
      "content":"这是个群通知"
  }
  ```

- response: 

  - code: number，状态码，200为成功，其他为失败
  - msg: string，信息，`ok`为成功，其他为错误信息

  ```json
  {
    "code": 200,
    "msg": "ok"
  }
  ```

### /get_members

- 功能: 获取群成员列表

- method: GET

- response: 

  - code: number，状态码，200为成功，其他为失败
  - msg: string，信息，`ok`为成功，其他为错误信息
  - members: array，群成员列表

  ```json
  {
    "code": 200,
    "msg": "ok",
    "members": [
      {
        "age": 0,
        "area": "",
        "card": "",
        "card_changeable": false,
        "group_id": 298454304,
        "join_time": 1582827273,
        "last_sent_time": 1603089830,
        "level": "1",
        "nickname": "qwqwqwqwqw",
        "role": "owner",
        "sex": "unknown",
        "title": "",
        "title_expire_time": 0,
        "unfriendly": false,
        "user_id": 12345678
      }
    ]
  }
  ```

  

