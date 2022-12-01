# Selection 对象
Selection 对象表示用户选择的选区或插入符号的当前位置，它可能横跨多个元素。

用户可能从左到右（与文档方向相同）选择文本或从右到左（与文档方向相反）选择文本。  

anchor （锚点）： 指用户开始选择的地方。  
focus  （焦点）： 指用户结束选择的地方。  

如果你使用鼠标选择文本的话，anchor 就指你按下鼠标键的地方，而 focus 就指你松开鼠标键的地方。anchor 和 focus 的概念不能与选区的起始位置和终止位置混淆，因为 anchor 可能在 focus 的前面，也可能在 focus 的后面，这取决于你选择文本时鼠标移动的方向，也就是按下鼠标键和松开鼠标键的位置。
如下图所示：  

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85babbb23bbb4c4184fe3bca683f7ba4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)  

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/713286e6aea9411cb4fa75d7508cb5e7~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

## 属性
+ anchorNode： 锚点（anchor）所在节点。
+ anchorOffset： 
  + 如果 anchorNode 是文本节点、注释节点，返回锚点（anchor）到该节点中第一个字的字符个数。
  + 如果 anchorNode 是元素节点，返回锚点（anchor）之前的同级节点总数。
+ focusNode： 焦点（focus）所在节点。
+ focusOffset：
  + 如果 focusNode 是文本节点、注释节点，返回焦点（focus）到该节点中的第一个字的字符个数。
  + 如果 focusNode 是元素节点，返回焦点（focus）之前的同级节点总数。
+ isCollapsed： 表示选区的起始位置和终止位置是否重合的 Boolean 值，如果为 true，可以认为当前没有内容选中。
+ rangeCount： 选区中包含的 Range 对象数量。
+ type： 描述当前选区的类型，有以下三个值：
  + None： 当前没有选择。
  + Caret： 仅单击，但未选择，选区已折叠（即光标在字符之间，并未处于选中状态）。
  + Range： 选择的是一个范围。

## 方法：

### addRange(range)


向选区（Selection 对象）中添加一个区域（ Range 对象）。
参数：
+ range： 一个区域对象
示例：
```html
<p id="text">文本</p>
```
```js
//添加一个选区
var text = document.querySelector("#text");
var selObj = window.getSelection();
var rangeObj = document.createRange();
rangeObj.selectNode(text);
selObj.addRange(rangeObj);
```
## collapse(parentNode,offset)
收起当前选区到一个点。文档不会发生改变。
参数：
+ parentNode： 光标落在的目标节点
+ offset： 可选，在目标节点内的偏移量
示例：
```html
<div contenteditable="true" id="text">文本</div>
```
```js
//收起选区到一个点，光标落在一个可编辑元素上
var text = document.querySelector("#text")
window.getSelection().collapse(text,0);
```
## collapseToEnd()
取消当前选区，并把光标定位在原选区的最末尾处。
参数：
无
示例：
```js
var selObj = window.getSelection();
selObj.collapseToEnd();
```
## collapseToStart()
取消当前选区，并把光标定位在原选区的最开始处。
参数：
无
示例：
```js
var selObj = window.getSelection();
selObj.collapseToStart();
```
## containsNode(aNode,aPartlyContained)
判断指定的节点是否包含在 Selection 对象中（即是否被选中）。
参数：
+ aNode： 用于判断是否包含在 Selection 对象中的节点。
+ aPartlyContained：
  + 当此参数为 true 时，Selection 对象包含 aNode 的一部分或全部时，containsNode() 方法返回true。
  + 当此参数为 false （默认值）时，只有 Selection 对象完全包含 aNode 时，containsNode() 方法才返回 true。
示例：
```html
<div id="text">文本</div>
```
```js
var text = document.querySelector("#text");
var selObj = window.getSelection();
var contains = selObj.containsNode(text);
```
## deleteFromDocument()

从 DOM 中删除选中的文档片段。
参数：
无
示例：
```js
var selObj = window.getSelection();
selObj.deleteFromDocument();
```
## extend(node,offset)
移动选区的焦点（focus）到指定的点。选区的锚点（anchor）不会移动。选区将从锚点（anchor）开始到新的焦点（focus），不管方向。
参数：
+ node： 焦点（focus）会被移至此节点内。
+ offset：  可选，默认值为0，焦点（focus）会被移至 node 内的偏移位置。
示例：
```html
<div id="text">文本</div>
```
```js
var text = document.querySelector("#text");
var selObj = window.getSelection();
selObj.extend(text);
```
## getRangeAt(index)

返回一个当前选区包含的 Range 对象。
参数：
index： 该参数指定 Range 对象的索引。如果该数值大于或等于 rangeCount ，将会报错。
示例：
//获取一个 Selection 对象
var selObj = window.getSelection();
//获取一个 Range 对象
var rangeObj  = selObj.getRangeAt(0);
复制代码


## modify(alter,direction,granularity)


通过文本命令来更改当前选区或光标位置。
参数：
alter：改变类型，传入 move 来移动光标位置，或者 extend 来扩展当前选区。
direction：调整选区的方向。你可以传入 forward 或 backward 来根据选区内容的语言书写方向来调整。或者使用 left 或 right 来指明一个明确的调整方向。
granularity：调整的距离颗粒度。可选值有 character、word、sentence、line、paragraph、lineboundary、sentenceboundary、paragraphboundary、documentboundary。
示例：
var selection = window.getSelection();
selection.modify("extend", "forward", "word");
复制代码


## removeAllRanges()


会从当前 Selection 对象中移除所有的 Range 对象，取消所有的选择。
参数：
无
示例：
var selObj = window.getSelection();
selObj.removeAllRanges();
复制代码


## removeRange(range)


将一个 Range 对象从选区中移除。
参数：
range： 一个将从选区中移除的 Range 对象。
示例：
var selObj = window.getSelection();
var rangeObj = selObj.getRangeAt(0)
selObj.removeRange(rangeObj);
复制代码


## selectAllChildren(parentNode)


把指定元素的所有子元素设置为选区（该元素本身除外），并取消之前的选区。
参数：
parentNode： 指定元素
示例：
<div id="selectAll">
	<div>文本1</div>
	<div>文本2</div>
</div>
复制代码
var selectAll = document.querySelector("#selectAll");
var selObj = window.getSelection();
selObj.selectAllChildren(selectAll);
复制代码


## setBaseAndExtent(anchorNode,anchorOffset,focusNode,focusOffset)


选中两个特定 DOM 节点之间的内容。
参数：
anchorNode： 选中内容的开始节点
anchorOffset：选区起始位置在 anchorNode 内的偏移量。
如果 anchorNode 是文本节点，表示选区起始位置在该节点第几个字符位置。
如果 anchorNode 是元素节点，表示选区起始位置在该节点内第几个子节点的位置。
focusNode： 选中内容的结束节点
focusOffset： 选区终止位置在 focusNode 内的偏移量。
如果 focusNode 是文本节点，表示选区终止位置在该节点第几个字符位置。
如果 focusNode 是元素节点，表示选区终止位置在该节点内第几个子节点的位置。
示例：
<div id="start"></div>
<div id="end"></div>
复制代码
var start = document.querySelector("#start");
var end = document.querySelector("#end");
var selObj = window.getSelection();
selObj.setBaseAndExtent(start,0,end,0);
复制代码


## toString()


返回代表当前 Selection 对象的字符串，例如当前选择的文本。
参数：
无
示例：
var selObj = window.getSelection();
selObj.toString();

作者：FEWY
链接：https://juejin.cn/post/6976147434938302471
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。