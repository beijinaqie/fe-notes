# ASR语音识别

## 请求地址
wss://digitalmanpoc.xiaoi.com/native-ws/cc?vadEndSilence=1400

## 请求类型
websocket

## url参数
参数名称|是否必填|描述
:-|:-:|:-
vad_sensitivity|否|收音灵敏度，取值范围 0~1，值约低越容易收音，默认 0.7
vad_end_silence|否|引擎判断一句话结束的结尾处静音时长。单位 ms，默认 700
vad_start_silence|否|引擎片段没有输入有效音频的时长。单位 ms，默认 25000
vad_max_speech|否|一句话的最大时长。单位 ms，默认-1，即无限制

## 备注
此接口经过王军转发，appkey和token以及tenantId可不填

## demo
```js

const websocket = new WebSocket('wss://digitalmanpoc.xiaoi.com/native-ws/cc?vadEndSilence=1400')

// 建立连接
websocket.onopen = () => {
  // 像服务器发送数据
  websocket.send('[start]')
}

// 接收服务器数据
websocket.onmessage = (message) => {
  // 接收服务器数据
}

// 断开链接
websocket.onclose = () => {
  // 超时或者服务器主动断开链接
}

// 链接出错
websocket.onerror = () => {
  // 建立连接失败
}
```

# 根据文本获取答案

## 请求地址
/reply/answer/text

## 请求类型
get

## url参数
参数名称|是否必填|描述
:-|:-:|:-
platform|否|维度选项，平台，默认 `wx`
brand|否|维度选项，品牌，默认 `all`
tenantId|是|租户id
userId|是|用户id
question|是|问题
[, options]|否|可接收其它维度选项

## 备注
此接口请求robot机器人

## demo
```js

async function fetchApi() {
  const options = {
    method: "GET", 
    headers: {
      "Content-Type": "application/json"
    }
  }
  let res = await fetch('/reply/answer/text?platform=wx&brand=all&tenantId=租户id&userId=用户id&question=问题', options)

  if (res.ok) {
    const data = await res.json();
    // 数据对象
  }
}

```

# 获取百度开发者平台token

## 请求地址
https://aip.baidubce.com/oauth/2.0/token

## 请求类型
post

## url参数
参数名称|是否必填|描述
:-|:-:|:-
grant_type|是|参数为`client_credentials`
client_id|是|应用的API Key
client_secret|是|应用的Secret Key

## 备注
API Key、Secret Key 均可在百度智能云控制台 各技术方向概览页的应用列表 处获取，若无应用请先进行创建；  

API Key、Secret Key用于接口调用鉴权，请务必注意保密，不可在公开文档或代码中以明文展示，否则可能导致账号被盗用。

[参考链接](https://ai.baidu.com/ai-doc/REFERENCE/Ck3dwjhhu)

## demo
```js
async function fetchApi() {
  const options = {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    }
  }
  let res = await fetch('/reply/answer/text?grant_type=client_credentials&client_id=应用api key&client_secret=应用secret key', options)

  if (res.ok) {
    const data = await res.json();
    // 数据对象
  }
}
```

# 调用百度技能

## 请求地址
https://aip.baidubce.com/rpc/2.0/unit/service/v3/chat

## 请求方式
post

## url参数
参数名称|是否必填|描述
:-|:-:|:-
access_token|是|通过API Key和Secret Key获取的access_token

## data参数
参数结构约定
示例|说明
:-|:-
+|"+"号表示字段层级，首层为第0层级  
aaa[].bbb|aaa是一个list，bbb是list中的一个元素的属性
aaa{}.bbb|	aaa是一个kvdict，bbb是某个key下的一个value的属性
enum|	枚举值
optional|	用于描述应答参数，表明某个参数在应答中不一定存在

参数名称|是否必填|描述
:-|:-:|:-
version|是|参数为 `3.0`
service_id|是|机器人ID
log_id|是|开发者需要在客户端生成的唯一id，用来定位请求，响应中会返回该字段。对话中每轮请求都需要一个log_id
session_id|是|session保存机器人的历史会话信息，由机器人创建，客户端从上轮应答中取出并直接传递，不需要了解其内容。如果为空，则表示清空session（开发者判断用户意图已经切换且下一轮会话不需要继承上一轮会话中的词槽信息时可以把session置空，从而进行新一轮的会话）。开发者可以通过传送session_id的方式实现多轮对话。具体操作方式见【请求参数详细说明】
request|是|本轮请求体
+terminal_id|是|参数为 `admin`
+query|是|聊天的问题

## 备注

[参考链接](https://ai.baidu.com/ai-doc/UNIT/qkpzeloou#%E5%93%8D%E5%BA%94%E5%8F%82%E6%95%B0%E8%AF%A6%E7%BB%86%E8%AF%B4%E6%98%8E)

## demo 
```js
async function fetchApi(msg) {
  const options = {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      version: "3.0",
      log_id: String(Date.now()),
      service_id: 机器人id,
      session_id: '',
      request: {
        terminal_id: "admin",
        query: msg,
      },
    }
  }
  let res = await fetch('/reply/answer/text?access_token=token', options)

  if (res.ok) {
    const data = await res.json();
    // 数据对象
  }
}
```

# tts语音token
拼接 secret 和日期字符串，如“2022-01-01”，在用md5加密

## demo
```js
let str = secret + "2022-01-01";
let token = MD5(str).toString()
```

# tts语音合成

## 请求地址
wss://voiceapi.xiaoi.com/api/v1/liveTTs

## 请求方式
websocket

## url参数
参数名称|是否必填|描述
:-|:-:|:-
tenantId|是|租户id
appKey|是|应用key
token|是|token
voiceName|是|可选音库名，默认为 `max`， bella（中文女声）xiaobei（中文女声）xiaobing（中文女声）xiaobing（中文女声）xiaoxiang（中文女声）xiaoqing（中文女声）jessica（中文女声）junjun（中文女声）guangguang （中文男声）max（中文男声）


## 备注

机器人

## demo
```js

const websocket = new WebSocket('wss://voiceapi.xiaoi.com/api/v1/liveTTs?tenantId=租户id&userId=租户id&appKey=应用key&token=token&voiceName=max')

// 建立连接
websocket.onopen = () => {
  // 像服务器发送数据
  websocket.send('[start]')
}

// 接收服务器数据
websocket.onmessage = (message) => {
  // 接收服务器数据
}

// 断开链接
websocket.onclose = () => {
  // 超时或者服务器主动断开链接
}

// 链接出错
websocket.onerror = () => {
  // 建立连接失败
}
```