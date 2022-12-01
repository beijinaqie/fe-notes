<!-- TOC -->

- [位、字节、字](#位字节字)
- [字符集、编码](#字符集编码)
- [字节序](#字节序)
- [TypedArray](#typedarray)
  - [Int8Array](#int8array)
  - [Uint8Array](#uint8array)
  - [Uint8ClampedArray](#uint8clampedarray)
  - [Int16Array](#int16array)
  - [Uint16Array](#uint16array)
  - [Int32Array](#int32array)
  - [Uint32Array](#uint32array)
  - [Float32Array](#float32array)
  - [Float64Array](#float64array)
- [DataView](#dataview)
  - [setUint8](#setuint8)
  - [getUint8](#getuint8)
- [ArrayBuffer](#arraybuffer)
- [Blob](#blob)
- [Object URL](#object-url)
- [File](#file)
- [FileReader](#filereader)
- [互相转换](#互相转换)
  - [Blob转File](#blob转file)
  - [File转Blob](#file转blob)
  - [Blob转Base64](#blob转base64)
  - [File转Base64](#file转base64)
  - [img转Base64](#img转base64)
  - [Base64转Blob](#base64转blob)
  - [Base64转File](#base64转file)
  - [TextEncoder](#textencoder)
    - [encode](#encode)
  - [TextDecoder](#textdecoder)
    - [decode](#decode)

<!-- /TOC -->
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11022bad363a4473bc303c3aaf5b01ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

[JS 中的 typedArray, ArrayBuffer 和 DataView怎么分清楚](https://www.zhihu.com/question/489316776/answer/2470498688)

[掘金文章地址](https://juejin.cn/post/7005810137491308580);  
本质上，ArrayBuffer 字节数组就是一段固定长度大小的二进制数据缓冲区。它并不能直接操作，我们需要通过 TypedArray 和 DataView 来进行对于 ArrayBuffer 的操作。
```js
// 创建8个字节长度的缓存冲
const buffer = new ArrayBuffer(8);

const dataView = new DataView(buffer);
// 获取对应buffer内容
console.log(dataView.buffer)

const typedArray = new Uint8Array(buffer);
// 获取对应buffer内容
console.log(typedArray.buffer);
```
# 位、字节、字

位(bit)、字节(byte)、字(word)是计算机数据存储的单位。位是最小的存储单位，每一个位存储一个1位的二进制码，一个字节由8位组成。而字通常为16、32或64个位组成。 

位是最基本的概念，在计算机中，由于只有逻辑0和逻辑1的存在，因此很多东西、动作、数字都要表示为一串二进制的字码例如： 1001 0000 1101等等。其中每一个逻辑0或者1便是一个位。例如这个例子里的1000 1110共有八个位，它的英文名字叫（bit），是计算机中最基本的单位。  

字节，是由八个位组成的一个单元，也就是8个bit组成1个Byte。字节有什么用呢？ 在计算机科学中，用于表示ASCII字符，便是运用字节来记录表示字母和一些符号~例如字符A便用 “0100 0001”来表示。  

字 代表计算机处理指令或数据的二进制数位数，是计算机进行数据存储和数据处理的运算的单位。对于32位计算机与64位计算机，字的大小往往不同。32位计算机：1字=32位=4字节，64位计算机：1字=64位=8字节  

所以1字节就是8位。1字有可能是2字节、4字节、8字节

# 字符集、编码
字符集即是文字符号和二进制的一种映射关系。因为电脑只认识二进制，所以就需要把我们平时使用的字符来用二进制表示并存储到电脑。常用的字符集有ASCII、unicode、GB2312/GBK  

比如在ASCII字符集中，大写字母A对应的ASCII码是65，二进制就是01000001；阿拉伯数字0对应的ASCII码是48，二进制就是110000；还有空格32、回车13等等一些键盘上所见的符号。  

由于ASCII是美国信息交换标准代码，ASCII起初只规定了128个字符 (0-9的数字，A-Z大写和小写英文字母，以及一些特殊字符。)，就能代表了所有键盘上的普通符号、阿拉伯数字和英文字母。对于英文国家来说能满足日常使用，所以他们把每个字节的第一位置置0，只需要使用后面7位就足够了。（也就是只需要使用7位，2的7次方，能表示128个不同字符）。  

但是其他欧洲国家比如法语、葡萄牙语等无法用128个字符表示完全，所以他们就把第一个空闲0使用了起来。因此欧洲国家用一个字节（8位可表示256个字符）也能实现。所以ASCII有128和256两种版本。  

随着计算机在全球的发展和普及开来，其他语言，比如中文、日文，单字节256个字符肯定没法完全表示。所以就出现了一个全球统一的编码规则叫unicode，它的作用是把各个语言的字符映射为二进制和ASCII的目的一样。  

由于unicode编码都是两字节的，偏僻的可能用了四字节。也就是说至少会用到16位的内存空间，所以如果我们需要编码的文本都是英文的，那么用unicode是不是很浪费，明明一个字节就可以，却用了两字节。因此就出现了后面的编码。  

常见的编码有UFT-8、UTF-16、UTF-32。我们来说说平时使用的最多的UTF-8，UTF-8编码把一个Unicode字符根据不同的数字大小编码成1-6个字节，常用的英文字母被编码成1个字节，汉字通常是3个字节，只有很生僻的字符才会被编码成4-6个字节。如果你要传输的文本包含大量英文字符，用UTF-8编码就能节省空间。  

所以总结就是：
ASCII、unicode、GB2312/GBK都是是字符集，定义每个字符对应的数字。UTF-8、UTF-16等是unicode字符集的编码格式，定义“字符对应的数字”如何以二进制的方式存储。

作者：苏苏同学
链接：https://juejin.cn/post/7046313942938812424
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

# 字节序
首先说一下什么是字节序，字节序是数值在内存中的存储方式。分为小端字节序（little-endian）和大端字节序（big-endian）两种
所有的英特尔处理器都使用小端字节序，我们个人电脑基本都是小端字节序，小端字节序会把最不重要的放在最前，可类比欧洲通用的日期书写方式（例如，31 December 2050。年份是最重要的，月份其次，日期最后）
大端字节序则是相反的顺序，可类比 ISO 日期格式（例如 2050-12-31）。big-endian 通常被称作"网络字节顺序"（"network byte order"）, 因为互联网标准通常要求数据使用 big-endian 存储，从标准 Unix 套接字（socket）层开始，一直到标准化网络的二进制数据结构。

作者：小十七_
链接：https://juejin.cn/post/7005810137491308580
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
TypedArray 中，字节序会跟随系统的字节序，于是基本都是小端字节序，是不支持自己设置的，于是就会带来一个问题：如果从网络请求来的数据是大端字节序，会导致数据无法解析。

相比之下，DataView 可以支持设置字节序，举个例子：
```js
const buffer = new ArrayBuffer(24);
const dv = new DataView(buffer);

// 小端字节序
const v1 = dv.getUint16(1, true);

// 大端字节序
const v2 = dv.getUint16(3, false);

// 大端字节序
const v3 = dv.getUint16(3);
```
DataView 实例方法的第二个参数，可以用来设置字节序，默认是大端字节序

如果不确定计算机上的字节序，可以通过这个方法来判断：
```js
const littleEndian = (function() {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
})();
```
如果返回true，就是小端字节序；如果返回false，就是大端字节序。

这部分具体可以参考：[es6.ruanyifeng.com/#docs/array…](https://es6.ruanyifeng.com/#docs/arraybuffer)
# TypedArray
TypeArray 是一个概念，是es6新出的一个接口，不能直接被实例化
```js
// 会出错
new TypedArray()

new TypedArray(); // ES2017中新增
new TypedArray(length);
new TypedArray(typedArray);
new TypedArray(object);
new TypedArray(buffer [, byteOffset [, length]]);

作者：小十七_
链接：https://juejin.cn/post/7005810137491308580
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```
因为这个东西是一个抽象接口，只能去实例化其子类(子类会实现)。  
对于node.js而言，我们用Buffer来操作二进制数据，对前端而言，在TypeArray出现之前，是无法直接操作二进制数据的  
所以TypeArray接口的作用就是操作二进制数据,TypeArray是一个类数组结构，所以数组可以用的函数，比如arr[0],splice,copy等方法TypeArra也可以使用
+ Int8Array：8位有符号整数，长度1个字节。（-128~127）
+ Uint8Array：8位无符号整数，长度1个字节。（0~255）
+ Int16Array：16位有符号整数，长度2个字节。（-32768,32767）
+ Uint16Array：16位无符号整数，长度2个字节。（0~65535）
+ Int32Array：32位有符号整数，长度4个字节。（-2147483648~2147483647）
+ Uint32Array：32位无符号整数，长度4个字节。（0~4294967295）
+ Float32Array：32位浮点数，长度4个字节。
+ Float64Array：64位浮点数，长度8个字节。
## Int8Array
## Uint8Array
## Uint8ClampedArray
## Int16Array
## Uint16Array
## Int32Array
## Uint32Array
## Float32Array
## Float64Array
# DataView
在了解了 TypedArray 之后，我们来看看另一种操作 ArrayBuffer 的方式：DataView  
相较于 TypedArray，DataView 对于 ArrayBuffer 的操作更加灵活。  
我们可以发现在 TypedArray 中操作二进制 ArrayBuffer 时每个元素占用的字节大小是固定的，要么每个元素占用8位、16位或者32位。  
而 DataView 对于 ArrayBuffer 的操作就显得更加灵活了，我们可以通过 DataView 从 ArrayBuffer 中自由的读写多种数据类型，从而控制字节顺序。  
DataView 视图是一个可以从 二进制ArrayBuffer 对象中读写多种数值类型的底层接口，使用它时，不用考虑不同平台的字节序问题。
简单来讲，想较与 TypedArray 每个元素中固定的字节大小，我们可以通过 DataView 来自由的操作 ArrayBuffer 。
```js
new DataView(buffer [, byteOffset [, byteLength]])

// 创建8个字节长度的缓存冲
const buffer = new ArrayBuffer(8);

// 根据传入的buffer 从第一个字节开始，并且字节长度为匹配buffer的长度
const dataView = new DataView(buffer);

/**
 * DataView {
    byteLength: 8,
    byteOffset: 0,
    buffer: ArrayBuffer {
      [Uint8Contents]: <00 00 00 00 00 00 00 00>,
      byteLength: 8
    }
  }
 */
console.log(dataView, 'dataView');

// log: 8
console.log(dataView.byteLength, 'dataView');
```
+ 第一个参数 buffer 为必填，它支持传入一个 ArrayBuffer 表示 DataView 中的源数据。
+ 第二个参数 byteOffset 选填，它表示创建 DataView 时开头从 buffer 的哪个字节开始，可以作为启始偏移量。未指定时，默认从第一个字节开始。
+ 第三个参数 btyeLength 选填，它表示创建该 DataView 时的长度，当不传递默认时表示匹配 buffer 的长度
## setUint8
```js
// 创建8个字节长度的缓存冲
const buffer = new ArrayBuffer(8);

// 根据传入的buffer 从第一个字节开始，并且字节长度为匹配buffer的长度
const dataView = new DataView(buffer);

// 将DataView中偏移量为0个字节的字节，也就是第一个字节设置为十进制的1
dataView.setUint8(0, 1);
// 将DataView中偏移量为1个字节的字节，也就是第二个字节设置为十进制的2
dataView.setUint8(1, 2);
```
+ 第一参数为 byteOffset，它表示设置的字节偏移量，偏移量单位为字节
+ 第二个参数 value，它表示设置的值。为 10 进制表示法。
![setUnit8前](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50cc672e2a3942008ea094eaebe2d29d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)
当代码执行到 dataView.setUint8(0, 1) 时，表示我们将要给 dataView 中以 8位（一个字节位单位）设置偏移量为 0 （表示第一个字节），设置它的值为 1 （10进制）。
![setUnit8后](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8e1e9ba6df444ff9af293d7e307eb25~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)
分别将第一个字节(8位)的值变为 1 和将第二个字节变为 10 进制的 2
## getUint8
```js
// 创建8个字节长度的缓存冲
const buffer = new ArrayBuffer(8);

// 根据传入的buffer 从第一个字节开始，并且字节长度为匹配buffer的长度
const dataView = new DataView(buffer);

// 将DataView中偏移量为0个字节的字节，也就是第一个字节设置为十进制的1
dataView.setUint8(0, 1);
// 将DataView中偏移量为1个字节的字节，也就是第二个字节设置为十进制的2
dataView.setUint8(1, 2);

// 从dataView中偏移第0个字节，也就是第一个字节，获取8位
// log: 1
dataView.getUint8(0);

// 从dataView中偏移第一个字节获取八位，也就是获取第二个字节的值
// log: 2
dataView.getUint8(1);

console.log(dataView.getUint8(0));
console.log(dataView.getUint8(1));

```
# ArrayBuffer
ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。它是一个字节数组，通常在其他语言中称为“byte array”。  
你不能直接操作 ArrayBuffer 的内容，而是要通过TypeArray或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。  
它的含义类似 NodeJs 中的 Buffer 。简单来说，我们可以通过 ArrayBuffer 来开辟一段二进制数据空间，但是它只能通过 TypedArray 或者 DataView 来进行操作
```js
// 创建一个长度为 8 的 ArrayBuffer ，此时开辟一个固定 8 个字节的缓冲区也就是 64 位
const buffer = new ArrayBuffer(8);

console.log(buffer.byteLength);
```
![buffer](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd3e5dec8da94354898c1ca4b51ccaf8~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)
上图中每一个无间隔小块代表一个位，8位组成一个字节。每一个存在间隔的长块表示一个字节，整个8个字节组成了我们创建的 buffer 对象。
# Blob
Blob 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作。
```js
const aBlob = new Blob( array, options );
```
+ 第一个参数 array 是一个由ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的 Array ，或者其他类似对象的混合体，它将会被放进 Blob。DOMStrings会被编码为UTF-8。
+ 第二个参数 options 是一个对象，它拥有如下属性：
  + type，默认值为 ""，它代表了将会被放入到blob中的数组内容的MIME类型。
  + endings，默认值为"transparent"，用于指定包含行结束符\n的字符串如何被写入。 它是以下两个值中的一个： "native"，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者 "transparent"，代表会保持blob中保存的结束符不变。
```js

const name = JSON.stringify({ name: '19QIngfeng' });

// 传入DOMString创建blob
const blob = new Blob([name], {
  type: 'application/json',
});

// log: 21 utf8中一个英文代表一个字节
console.log(blob.size);

const buffer = new ArrayBuffer(8);

// 传入ArrayBuffer创建blob
const bufferToBlob = new Blob([buffer]);

// log: 8 
console.log(bufferToBlob.size);
```
FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。
我们可以结合 FileReader Api 来读取对应 blob 的内容，并且将它转化为各种我们需要得到的格式：

```js
const name = JSON.stringify({
  name: '19QIngfeng'
});

// 传入DOMString创建blob
const blob = new Blob([name], {
  type: 'application/json',
});

/**
 *
 * @param {*} blob blob 对象
 * @param {*} type 输出的结果
 */
function getBlobByType(blob, type) {
  const fileReader = new FileReader(blob);
  switch (type) {
    // 读取文件的 ArrayBuffer 数据对象.
    case 'arrayBuffer':
      fileReader.readAsArrayBuffer(blob);
      break;
      // 读取文件为的字符串
    case 'DOMstring':
      fileReader.readAsText(blob, 'utf8');
      break;
      // 读取文件为data: URL格式的Base64字符串
    case 'dataUrl':
      fileReader.readAsDataURL(blob);
      break;
      // 读取文件为文件的原始二进制数据（已废弃不推荐使用）
    case 'binaryString':
      fileReader.readAsBinaryString(blob);
      break;
    default:
      break;
  }

  return new Promise((resolve) => {
    // 当文件读取完成时候触发
    fileReader.onload = (e) => {
      // 获取最终读取结果
      const result = e.target.result;
      resolve(result);
    };
  });
}

// ArrayBuffer 对象
getBlobByType(blob, 'arrayBuffer').then((res) => console.log(res));

// {"name":"19QIngfeng"}
getBlobByType(blob, 'DOMstring').then((res) => console.log(res));

// data:application/json;base64,eyJuYW1lIjoiMTlRSW5nZmVuZyJ9
getBlobByType(blob, 'dataUrl').then((res) => console.log(res));

// {"name":"19QIngfeng"}
getBlobByType(blob, 'binaryString').then((res) => console.log(res));
```
# Object URL
大多数情况下，我们可以看到一些网页内部可以看到一些诸如此类的 Blob Url：

我们可以看到视频标签 vide 的 src 属性正式一个 Blob 类型的 Url。
关于 Blob URL/Object URL 其实它们是一种伪协议，允许将 Blob 和 File 对象用作图像、二进制数据下载链接等的 URL 源。它的好处其实有很多，比如：
平常我们并不可以直接处理 Image 标签之类的原始二进制数据，所以对于图片等需要 Url 作为源的标签通常做法是将图片上传到服务器上得到一个 Url 从而通过 URL 加载二进制数据。
与其上传二进制数据，然后通过 URL 将其返回，不如使用 Blob/Object Url 无需额外的步骤，使用浏览器本地 Api 即可直接访问数据而不需要通过服务器来上传数据。
当然，一些小伙伴可能会有疑惑。Base64 字符串编码不也可以解决上述说的问题吗。重点是相较于 base64 编码来说， Blob 是纯二进制字节数组，不会像 Data-URI 那样有任何显着的开销，这使得它们处理起来更快更小。
同时这些 URL 只能在浏览器的单个实例和同一会话（即页面/文档的生命周期）中本地使用，这意味者离开当前浏览器实例这个 URL 就会失效。
我们可以通过 URL.createObjectURL(object) 来创建对应的 Object URL，这个方法会返回一个 DOMString 字符串，其中包含一个表示参数中给出的对象的URL。
同时,这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
在创建时候它会接受一个参数：

object 表示用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象。

同样它会返回一个DOMString包含了一个对象URL，该URL可用于指定源 object的内容。
返回的 DOMString 格式为 blob:<origin>/<uuid>。  

当然，当在你的网页上不再使用通过 URL.createObjectURL(object) 创建的 URL 时，记得使用 URL.revokeObjectURL(url) 来主动释放它们。
```js
const name = JSON.stringify({
  name: '19QIngfeng',
});

// 传入DOMString创建blob
const blob = new Blob([name], {
  type: 'application/json',
});

// 创建 Object Url
const url = URL.createObjectURL(blob);

const aLink = document.createElement('a');

// href属性
aLink.href = url;
// 定义下载的文件名
aLink.download = 'name.json';

// 派发a链接的点击事件
aLink.dispatchEvent(new MouseEvent('click'));

// 下载完成后，释放 URL.createObjectURL() 创建的 URL 对象。
URL.revokeObjectURL(url);
```
# File
# FileReader
FileReader.readAsArrayBuffer()
开始读取指定的 Blob中的内容，一旦完成，result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象。

FileReader.readAsBinaryString() 非标准
开始读取指定的Blob中的内容。一旦完成，result属性中将包含所读取文件的原始二进制数据。

FileReader.readAsDataURL()
开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL 格式的 Base64 字符串以表示所读取文件的内容。

FileReader.readAsText()
开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个字符串以表示所读取的文件内容。


# 互相转换
## Blob转File
```js
const blob1 = new Blob(["blob文件"], { type: "text/plain" });
// blob转file
const file2 = new File([blob1], "test2", { type: blob1.type });
console.log("file2: ", file2);
```
## File转Blob
```js
const file1 = new File(["文件对象"], "test", { type: "text/plain" });
// file转blob
const blob2 = new Blob([file1], { type: file1.type });
console.log("blob2: ", blob2);
```
## Blob转Base64
```js
// Blob转Base64
const blob = new Blob(["hello", "randy"], { type: "text/plain" });

const fileReader = new FileReader();

fileReader.readAsDataURL(blob);

fileReader.onload = () => {
  console.log(fileReader.result); // "data:text/plain;base64,aGVsbG9yYW5keQ=="
};
```
## File转Base64
```js
// File转Base64
const file1 = new File(["文件对象"], "test", { type: "text/plain" });

const fileReader = new FileReader();

fileReader.readAsDataURL(file1);

fileReader.onload = () => {
  console.log(fileReader); // "data:text/plain;base64,5paH5Lu25a+56LGh"
};
```
## img转Base64
```js
// 本地图片转base64，注意链接是本地链接不能是网络地址。
const img2base64 = (imgUrl) => {
  let image = new Image();
  image.src = imgUrl;
  return new Promise((resolve) => {
    image.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      let dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    };
  });
};

img2base64("../vue2/src/assets/logo.png").then((res) => {
  console.log(res);
});
```
## Base64转Blob
```js
function dataURLtoBlob(dataurl) {
  // `data:[<mediatype>][;base64],<data>`
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
```
## Base64转File
```js
function dataURLtoFile(dataurl, filename) {
  //将base64转换为文件
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
```
## TextEncoder
TextEncoder 接受码位流作为输入，并提供 UTF-8 字节流作为输出
### encode
接受一个字符串作为输入，返回一个包含 UTF-8 编码的文本的 Uint8Array。
```js
const encoder = new TextEncoder()
const view = encoder.encode('€')
console.log(view); // Uint8Array(3) [226, 130, 172]

```
## TextDecoder
TextDecoder 接口表示一个文本解码器，一个解码器只支持一种特定文本编码，例如 UTF-8、ISO-8859-2、KOI8-R、GBK，等等。解码器将字节流作为输入，并提供码位流作为输出。
### decode
返回一个字符串，其中包含使用特定 TextDecoder 对象的方法解码的文本。
```js
let utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8'

let u8arr = new Uint8Array([240, 160, 174, 183]);
let i8arr = new Int8Array([-16, -96, -82, -73]);
let u16arr = new Uint16Array([41200, 47022]);
let i16arr = new Int16Array([-24336, -18514]);
let i32arr = new Int32Array([-1213292304]);

console.log(utf8decoder.decode(u8arr));
console.log(utf8decoder.decode(i8arr));
console.log(utf8decoder.decode(u16arr));
console.log(utf8decoder.decode(i16arr));
console.log(utf8decoder.decode(i32arr));

```