[TOC]

# 客户端websocket

STOMP(Simple Text-Orientated Messaging Protocol) 面向消息的简单文本协议

WebSocket是一个消息架构，不强制使用任何特定的消息协议，它依赖于应用层解释消息的含义；

与处在应用层的HTTP不同，WebSocket处在TCP上非常薄的一层，会将字节流转换为文本/二进制消息，因此，对于实际应用来说，WebSocket的通信形式层级过低，因此，可以在 WebSocket 之上使用 STOMP协议，来为浏览器 和 server间的 通信增加适当的消息语义。

如何理解 STOMP 与 WebSocket 的关系：

+ HTTP协议解决了 web 浏览器发起请求以及 web 服务器响应请求的细节，假设 HTTP 协议 并不存在， 只能使用 TCP 套接字来 编写 web 应用，你可能认为这是一件疯狂的事情；
+ 直接使用 WebSocket（SockJS） 就很类似于 使用 TCP 套接字来编写 web 应用，因为没有高层协议，就需要我们定义应用间所发送消息的语义，还需要确保连接的两端都能遵循这些语义；
+  同 HTTP 在 TCP 套接字上添加请求-响应模型层一样，STOMP 在 WebSocket 之上提供了一个基于帧的线路格式层，用来定义消息语义；

## stompjs

### 发起连接

socket连接对象也可通过WebSocket(不通过SockJS)连接。

```js
var socket=new WebSocket("/spring-websocket-portfolio/portfolio");
```

stompClient.connect()方法签名

```js
client.connect(headers, connectCallback, errorCallback);
```

headers表示客户端的认证信息，如

```js
var headers = {
  login: 'mylogin',
  passcode: 'mypasscode',
  // additional header
  'client-id': 'my-client-id'
};
```

若无需认证，直接使用空对象 “{}” 即可；

connectCallback 表示连接成功时（服务器响应 CONNECTED 帧）的回调方法；
errorCallback 表示连接失败时（服务器响应 ERROR 帧）的回调方法，非必须；

### 断开连接

若要从客户端主动断开连接，可调用 disconnect() 方法

```js
client.disconnect(function () {
   alert("See you next time!");
};
```

该方法为异步进行，因此包含了回调参数，操作完成时自动回调；

### 心跳机制

若使用STOMP 1.1 版本，默认开启了心跳检测机制，可通过client对象的heartbeat field进行配置（默认值都是10000 ms)

```js
client.heartbeat.outgoing = 20000;  // client will send heartbeats every 20000ms
client.heartbeat.incoming = 0;      // client does not want to receive heartbeats from the server
// The heart-beating is using window.setInterval() to regularly send heart-beats and/or check server heart-beats
```

### 发送消息

连接成功后，客户端可使用 send() 方法向服务器发送信息：

```js
client.send(destination url[, headers[, body]]);
```

其中
destination url 为服务器 controller中 @MessageMapping 中匹配的URL，字符串，必须参数；
headers 为发送信息的header，JavaScript 对象，可选参数；
body 为发送信息的 body，字符串，可选参数；

```js
client.send("/queue/test", {priority: 9}, "Hello, STOMP");
client.send("/queue/test", {}, "Hello, STOMP");
```

### 订阅、接收消息

STOMP 客户端要想接收来自服务器推送的消息，必须先订阅相应的URL，即发送一个 SUBSCRIBE 帧，然后才能不断接收来自服务器的推送消息；
订阅和接收消息通过 subscribe() 方法实现：

```js
subscribe(destination url, callback[, headers])
```

其中
destination url 为服务器 @SendTo 匹配的 URL，字符串；
callback 为每次收到服务器推送的消息时的回调方法，该方法包含参数 message；
headers 为附加的headers，JavaScript 对象；什么作用？
该方法返回一个包含了id属性的 JavaScript 对象，可作为 unsubscribe() 方法的参数；

```js
var headers = {ack: 'client', 'selector': "location = 'Europe'"};
var  callback = function(message) {
  if (message.body) {
    alert("got message with body " + message.body)
  } else {
    alert("got empty message");
  }
});
var subscription = client.subscribe("/queue/test", callback, headers);
```

### 取消订阅

针对单个订阅进行取消订阅

```js
var subscription = client.subscribe(...);

subscription.unsubscribe();
```

### json支持

STOMP 帧的 body 必须是 string 类型，若希望接收/发送 json 对象，可通过 JSON.stringify() and JSON.parse() 实现；

```js
var quote = {symbol: 'APPL', value: 195.46};
client.send("/topic/stocks", {}, JSON.stringify(quote));

client.subcribe("/topic/stocks", function(message) {
  var quote = JSON.parse(message.body);
  alert(quote.symbol + " is at " + quote.value);
});
```

### 事务支持

STOMP 客户端支持在发送消息时用事务进行处理

```js
// start the transaction
// 该方法返回一个包含了事务 id、commit()、abort() 的JavaScript 对象
var tx = client.begin();
// send the message in a transaction
// 最关键的在于要在 headers 对象中加入事务 id，若没有添加，则会直接发送消息，不会以事务进行处理
client.send("/queue/test", {transaction: tx.id}, "message in a transaction");
// commit the transaction to effectively send the message
tx.commit();
// tx.abort();
```

### debug信息

STOMP 客户端默认将传输过程中的所有 debug 信息以 console.log() 形式输出到客户端浏览器中，也可通过以下方式输出到 DOM 中

```js
client.debug = function(str) {
  // str 参数即为 debug 信息
  // append the debug log to a #debug div somewhere in the page using JQuery:
  $("#debug").append(str + "\n");
};
```



### 认证

## socks-client

SockJS是一个JavaScript库，提供跨浏览器JavaScript的API，创建了一个低延迟、全双工的浏览器和web服务器之间通信通道。

服务端：[sockjs-node](https://github.com/sockjs/sockjs-node)
客户端：[sockjs-clien](https://github.com/sockjs/sockjs-client)
[node-static](https://www.npmjs.com/package/node-static)是Node.js兼容HTTP静态文件服务器处理模块，提供内置的缓存支持。

SockJS模仿WebSockets API，但它不是WebSocket，而是一个SockJS Javascript对象。

### 建立连接

```js
// 建立连接对象
var sock = new SockJS('https://mydomain.com/my_prefix');
// 建立连接
sock.onopen = function () {
  console.log('open')
  // 发送消息
  sock.send('test')
}
// 监听服务端信息
sock.onmessage = function (e) {
  console.log('message', e.data)
  // 关闭连接
  sock.close()
}
// 监听关闭事件
sock.onclose = function () {
  console.log('close')
}
```



## 实例


```html
startWebsocket() {
		// 每次连接前，需要断开上一次连接
    if (this.stompClient) {
    	this.stompClient.disconnect();
    }
		// 建立连接对象
    const sockjs = new Sockjs(url);
		// 获取 STOMP 子协议的客户端对象
    this.stompClient = Stompjs.over(sockjs);
		// 关闭bug提示
    this.stompClient.debug = false;
		// 建立连接
    this.stompClient.connect(
      {}, // 无需认证，使用{}对象
			// 成功回调
      success => {
      	console.log(success);
				this.stompClient.subscribe(url, res => {
					console.log(res);
				})
      },
			失败回调
      err => {
      	console.log(err);
      }
    );
}
```

