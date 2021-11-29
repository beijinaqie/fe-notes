# js自定义事件

利用观察着模式，一个目标改变了，其他目标收到消息后根据消息进行某种变化

## new Event

```js
event = new Event(typeArg, eventInit);
```

+ `typeArg` string类型，表示创建事件的名称
+ `eventInit` 是 `EventInit` 类型的字典，接受以下
  + `"bubbles"`，可选，[`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)类型，默认值为 `false`，表示该事件是否冒泡。
  + `"cancelable"`，可选，[`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)类型，默认值为 `false`， 表示该事件能否被取消。
  + `"composed"`，可选，[`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)类型，默认值为 `false`，指示事件是否会在影子DOM根节点之外触发侦听器。

事件可以在`element`上面触发，也可以在`document`对象上触发

```js
// 创建一个支持冒泡且不能被取消的look事件

var ev = new Event("look", {"bubbles":true, "cancelable":false});
document.dispatchEvent(ev);

// 事件可以在任何元素触发，不仅仅是document
myDiv.dispatchEvent(ev);
```



## new CustomEvent

```js
event = new CustomEvent(typeArg, customEventInit);
```

+ `typeArg` string 类型，表示创建的事件名称
+ `customEventInit` 是 `CustomEventInit`字典类型参数
  + `"detail"` 可选的默认值是 null 的任意类型数据，是一个与 event 相关的值
  + `"bubbles"` 一个布尔值，表示该事件能否冒泡
  + `"cancelable"` 一个布尔值，表示该事件是否可以取消

```js
obj.addEventListener("cat", function(e) { process(e.detail) });

// create and dispatch the event
var event = new CustomEvent("cat", {
  detail: {
    hazcheeseburger: true
  }
});
obj.dispatchEvent(event);
```

