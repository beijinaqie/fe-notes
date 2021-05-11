[toc]

# iframe 父子组件通信

## 非跨域

### 父子调用

```js

<iframe name="iframeName" id="iframeId" src="child.html"></iframe>

/**
*1、通过iframe的ID获取子页面的dom，然后通过内置属性contentWindow取得子窗口的window对象
*   此方法兼容各个浏览器
*/
document.getElementById('iframeId').contentWindow.func(); 
document.getElementById('iframeId').contentWindow.document.getElementById('子页面中的元素ID');

/**
*2、通过iframe的name（名字）直接获取子窗口的window对象
*/
iframeName.window.func(); 
iframeName.window.document.getElementById('子页面中的元素ID'); 

/**
*3、通过window对象的frames[]数组对象直接获取子frame对象
*/
window.frames[0].func();
window.frames[0].document.getElementById('子页面中的元素ID');
//或
window.frames["iframeName"].func();
window.frames["iframeName"].document.getElementById('子页面中的元素ID');

```

### 子父调用

```js
/**
*通过parent或top对象获取父页面的window对象内元素及方法
*/
parent.window.func(); 
parent.window.document.getElementById('父页面中的元素ID');
//同理
top.window.func(); 
top.window.document.getElementById('父页面中的元素ID');
```

### 兄弟调用

```js
/*以下为在child1.html页面内访问兄弟frame页面*/
<iframe name="iframe1Name" id="iframe1Id" src="child1.html"></iframe>
<iframe name="iframe2Name" id="iframe2Id" src="child2.html"></iframe>
<iframe name="iframe3Name" id="iframe3Id" src="child3.html"></iframe>

/**
*1、通过兄弟iframe的ID获取其dom，然后通过内置属性contentWindow取得window对象
*   此方法兼容各个浏览器
*/
parent.window.document.getElementById('iframe2Id').contentWindow.func(); 
parent.window.document.getElementById('iframe3Id').contentWindow.document.getElementById('兄弟页面3中的元素ID');

/**
*2、通过iframe的name（名字）直接获取子窗口的window对象
*/
parent.window.iframe2Name.window.func(); 
parent.window.iframe3Name.window.document.getElementById('兄弟页面3中的元素ID'); 

/**
*3、通过window对象的frames[]数组对象直接获取子frame对象
*/
parent.window.frames[1].func();
top.window.frames[2].document.getElementById('兄弟页面3中的元素ID');
//或
parent.window.frames["iframe2Name"].func();
parent.window.frames["iframe3Name"].document.getElementById('兄弟页面3中的元素ID');
```

## 跨域通过postMessage

### Window.postMessage()语法

```js
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

+ otherWindow
  其他窗口的一个引用，写的是你要通信的window对象。
  例如：在iframe中向父窗口传递数据时，可以写成window.parent.postMessage()，window.parent表示父窗口。
+ message
  需要传递的数据，字符串或者对象都可以。
+ targetOrigin
  表示目标窗口的源，协议+域名+端口号，如果设置为“*”，则表示可以传递给任意窗口。在发送消息的时候，如果目标窗口的协议、域名或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。例如：
  window.parent.postMessage('hello world','http://xxx.com:8080/index.html')
  只有父窗口是http://xxx.com:8080时才会接受到传递的消息。
+ [transfer]
  可选参数。是一串和message 同时传递的 Transferable 对象，这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。我们一般很少用到。

### 需要监听的事件名为`"message"`

```js
window.addEventListener('message', function (e) {
    console.log(e.data)  //e.data为传递过来的数据
    console.log(e.origin)  //e.origin为调用 postMessage 时消息发送方窗口的 origin（域名、协议和端口）
    console.log(e.source)  //e.source为对发送消息的窗口对象的引用，可以使用此来在具有不同origin的两个窗口之间建立双向通信
})
```

### 父页面

```js
<body>
	<button onClick="sendInfo()">向子窗口发送消息</button>
	<iframe id="sonIframe" src="http://192.168.2.235/son.html"></iframe>
    <script type="text/javascript">

        var info = {
            message: "Hello Son!"
        };
		//发送跨域信息
		function sendInfo(){
			var sonIframe= document.getElementById("sonIframe");
			sonIframe.contentWindow.postMessage(info, '*');
		}
		//接收跨域信息
		window.addEventListener('message', function(e){
				alert(e.data.message);
		}, false);
    </script>
</body>
```

### 子页面

```js
<body>
	<button onClick="sendInfo()">向父窗口发送消息</button>
    <script type="text/javascript">

        var info = {
            message: "Hello Parent!"
        };
		//发送跨域信息
		function sendInfo(){
			window.parent.postMessage(info, '*');
		}
		//接收跨域信息
		window.addEventListener('message', function(e){
				alert(e.data.message);
		}, false);
    </script>
</body>
```





