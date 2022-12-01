Range 对象
Range 对象表示被选中的文档片段。一个 Range 对象可能包含整个元素节点，也可能包含元素节点的一部分，例如文本节点的一部分文字。用户通常只能选择一个 Range 对象，但是有的时候用户也有可能选择多个 Range 对象（只有火狐浏览器可以选择多个 Range 对象）。
可以用 Document 对象的 Document.createRange 方法创建 Range，也可以用 Selection 对象的 getRangeAt 方法获取 Range。另外，还可以通过 Document 对象的构造函数 Range() 来得到 Range。
属性：


collapsed：   返回一个表示起始位置和终止位置是否相同的 Boolean 值。


commonAncestorContainer：   返回包含 startContainer 和 endContainer 的最深一级的节点。


endContainer：   返回包含 Range 终点位置的节点。


endOffset：


如果 endContainer 是文本节点、注释节点，返回该节点第一个字到选区边界的字符个数（即被选中的字符个数）。


如果 endContainer 是元素节点，返回选区终止位置之后第一个节点之前的同级节点总数。




startContainer：  返回包含 Range 开始位置的节点。


startOffset：


如果 startContainer 是文本节点、注释节点，返回该节点第一个字到选区边界的字符个数（即未被选中的字符个数）。


如果 startContainer 是元素节点，返回选区起始位置第一个节点之前的同级节点总数。




注意：
以上所有属性都是只读属性。
方法：


cloneContents()


返回一个文档片段，它是 Range 对象中所有节点的副本。
参数：
无
示例：
// 在文档中插入选中元素
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
documentFragment = rangeObj.cloneContents();
document.body.appendChild(documentFragment);
复制代码


cloneRange()


返回一个 Range 对象的副本（两个对象各自做出改变，都不会影响另一方）。
参数：
无
示例：
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
clone = rangeObj.cloneRange(); 
复制代码


collapse(toStart)


向开始或结束方向折叠 Range 。
参数：
toStart： 可选，Boolean 值（默认值 false）， true 折叠到 Range 的开始方向，false 折叠到结束方向。
示例：
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
rangeObj.collapse(true);
复制代码


compareBoundaryPoints(how, sourceRange)


比较两个 Range 对象的起始位置节点或结束位置节点。
参数：
how 表示比较方法的常量：


	Range.END_TO_END ：比较 sourceRange 对象的结束位置节点和原 Range 对象的结束位置节点。
复制代码
	Range.END_TO_START ：比较 sourceRange 对象的结束位置节点和原 Range 对象的起始位置节点。
	Range.START_TO_END ：比较 sourceRange 对象的起始位置节点和原 Range 对象的结束位置节点。
	Range.START_TO_START ：比较 sourceRange 对象的起始位置节点和原 Range 对象的起始位置节点。       
复制代码
sourceRange： 一个与原 Range 对象比较的 Range 对象。
返回值
compare 表示一个数字：


	-1 ：原 Range 对象的比较节点在 sourceRange 对象的比较节点之前  
复制代码
	0 ：原 Range 对象的比较节点在 sourceRange 对象的比较节点的相同位置   
	1 ：原 Range 对象的比较节点在 sourceRange 对象的比较节点之后  
复制代码
示例：
<div id="range">range</div>
<div id="sourceRange">sourceRange</div>
复制代码
var range, sourceRange, compare;
range = document.createRange();
range.selectNode(document.querySelector("#rang"));
sourceRange = document.createRange();
sourceRange.selectNode(document.querySelector("#sourceRange"));
compare = range.compareBoundaryPoints(Range.START_TO_END, sourceRange);
复制代码


comparePoint(referenceNode,offset)


判断指定节点是在 Range 对象的之前、相同还是之后位置。
参数：
referenceNode： 与 Range 对象进行比较的节点。
offset： 在 referenceNode 内的偏移量。
如果 referenceNode 是文本节点、注释节点，offset 表示在该节点中字符的偏移位置。
如果 referenceNode 是元素节点，offset 表示在该节点中子元素的偏移位置。
示例：
<div id="range">range</div>
<div id="referenceNode">referenceNode</div>
复制代码
range = document.createRange();
range.selectNode(document.querySelector("#range"));
returnValue = range.comparePoint(document.querySelector("#referenceNode"), 0);
复制代码


createContextualFragment(tagString)


将 HTML 字符串转换为文档片段
参数：
tagString： 要转换的 HTML 字符串。
示例：
var tagString = "<div>node</div>";
var range = document.createRange();
var documentFragment = range.createContextualFragment(tagString);
document.body.appendChild(documentFragment);
复制代码


deleteContents()


从 DOM 中删除选中的文档片段，不返回删除的文档片段。
参数：
无
示例：
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
rangeObj.deleteContents();
复制代码


extractContents()


从 DOM 中删除选中的文档片段，返回删除的文档片段（不保留 DOM 事件）。
参数：
无
示例：
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
rangeObj.extractContents();
复制代码


getBoundingClientRect()


返回一个 DOMRect 对象，表示整个选区的位置信息。
参数：
无
示例：
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
var boundingRect = rangeObj.getBoundingClientRect();
复制代码


getClientRects()


返回一个选区内所有元素调用 Element.getClientRects() 方法所得结果的列表。表示选区在屏幕上所占的区域。
参数：
无
示例：
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
var boundingRect = rangeObj.getClientRects();
复制代码


insertNode(newNode)


在选区开始处插入一个节点。
参数：
newNode：  需要插入的节点
示例：
<div id="insertNode">insertNode</div>
<div id="node">node</div>
复制代码
range = document.createRange();
newNode = document.querySelector("#node");
range.selectNode(document.querySelector("#insertNode"));
range.insertNode(newNode);
复制代码


intersectsNode(referenceNode)


返回一个 Boolean 值，判断指定节点和 Range 对象是否相交。
参数：
referenceNode：需要比较的节点
示例：
<div id="referenceNode">referenceNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
referenceNode = document.querySelector("#referenceNode");
rangeObj.intersectsNode(referenceNode);
复制代码


isPointInRange(referenceNode,offset)


返回一个 Boolean 值，判断指定节点是否在 Range 对象内。
参数：
referenceNode：指定节点
offset：在 referenceNode 内的偏移量。
如果 referenceNode 是文本节点，offset 表示在该节点中字符的偏移位置。
如果 referenceNode 是元素节点，offset 表示在该节点中子元素的偏移位置。
示例：
<div id="referenceNode">referenceNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
referenceNode = document.querySelector("#referenceNode");
rangeObj.isPointInRange(referenceNode,0);
复制代码


selectNode(referenceNode)


将指定节点包含在 Range 对象内。
参数：
referenceNode：指定节点
示例：
<div id="referenceNode">referenceNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
referenceNode = document.querySelector("#referenceNode");
rangeObj.selectNode(referenceNode);
复制代码


selectNodeContents(referenceNode)


将指定节点的内容包含在 Range 对象内。
参数：
referenceNode：指定节点
示例：
<div id="referenceNode">referenceNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
referenceNode = document.querySelector("#referenceNode");
rangeObj.selectNodeContents(referenceNode);
复制代码


setEnd(endNode,endOffset)


设置选区的终止位置。
参数：
endNode：终止位置所在的节点
endOffset：在 endNode 内的偏移量。
如果 endNode 是文本节点、注释节点，endOffset 表示在该节点中字符的偏移位置。
如果 endNode 是元素节点，endOffset 表示在该节点中子元素的偏移位置。
示例：
<div id="endNode">endNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
var endNode = document.querySelector("#endNode");
rangeObj.setEnd(endNode,0)
复制代码


setEndAfter(referenceNode)


设置选区的结束位置在指定节点之后。
参数：
referenceNode：指定节点
示例：
<div id="referenceNode">referenceNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
var referenceNode = document.querySelector("#referenceNode");
rangeObj.setEndAfter(referenceNode)
复制代码


setEndBefore(referenceNode)


设置选区的结束位置在指定节点之前。
参数：
referenceNode：指定节点
示例：
<div id="referenceNode">referenceNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
var referenceNode = document.querySelector("#referenceNode");
rangeObj.setEndBefore(referenceNode)
复制代码


setStart(startNode,startOffset)


设置选区的起始位置。
参数：
startNode：起始位置所在的节点
startOffset：在 startNode 内的偏移量。
如果 startNode 是文本节点、注释节点，startOffset 表示在该节点中字符的偏移位置。
如果 startNode 是元素节点，startOffset 表示在该节点中子元素的偏移位置。
示例：
<div id="startNode">startNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
startNode = document.querySelector("#startNode");
rangeObj.setStart(startNode,0)
复制代码


setStartAfter(referenceNode)


设置选区的起始位置在指定节点之后。
参数：
referenceNode：指定节点
示例：
<div id="referenceNode">referenceNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
referenceNode = document.querySelector("#referenceNode");
rangeObj.setStartAfter(referenceNode)
复制代码


setStartBefore(referenceNode)


设置选区的起始位置在指定节点之前。
参数：
referenceNode：指定节点
示例：
<div id="referenceNode">referenceNode</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
referenceNode = document.querySelector("#referenceNode");
rangeObj.setStartBefore(referenceNode)
复制代码


surroundContents(newParent)


把指定节点插入选区的起始位置，然后把指定节点的内容替换为选区的内容。
参数：
newParent：指定节点
示例：
<div id="newParent">newParent</div>
复制代码
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
newParent = document.querySelector("#newParent");
rangeObj.surroundContents(newParent)
复制代码


toString()


返回代表当前 Range 对象的字符串，例如当前选择的文本。
参数：
无
示例：
var selObj = window.getSelection();
var rangeObj  = selObj.getRangeAt(0);
var rangeStr = rangeObj.toString();

作者：FEWY
链接：https://juejin.cn/post/6976147434938302471
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。