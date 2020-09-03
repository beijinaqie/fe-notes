[TOC]

## 正则类

### 1. 校验表情

```js
/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/
```

### 2. 校验url地址

```js
/^(?=^.{3,255}$)(http(s)?:\/\/)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([?&]\w+=[\w\u4e00-\u9fa5]*)*$/
```



## 工具类

### 1. js获取当前网页的header信息及变量

```js
/**
* @desc js获取当前网页的header信息及变量
* @return 当前网页的header信息
*/
const function getHeaders() {
    const req = new XMLHttpRequest();
    req.open('GET', document.location.href, false);
    req.send(null);
    const headerArr = req.getAllResponseHeaders().split('\n');
    const headers = {};
    headerArr.forEach(item => {
        if (item!==''){
          const index = item.indexOf(':');
          const key = item.slice(0,index);
          const value = item.slice(index+1).trim();
          headers[key] = value
        }
    })
    return headers
}
```



### 2. 数字输入框验证(保证输入框无法输入其它类型)

```js
/**
* @desc 数字输入框验证
* @param {object}
* - objData string 组件内data里面的数据
* - int number 限制输入的整数位数
* - float number 限制小数点的位数
* @return {}
*/
export function validateInput(e) {
  const reg = new RegExp(
    '(^\\d{1,' +
      (e.int ? e.int : 30) +
      '}(\\.\\d{0,' +
      (e.float ? e.float : 10) +
      '}){0,' +
      (e.float === 0 ? 0 : 1) +
      '})',
    ''
  );
  // eslint-disable-next-line no-eval
  return eval(
    `this.${e.objData} =
      String(this.${e.objData})
      .match(${reg})
      ? String(this.${e.objData}).match(${reg})[0]
      : ''`
  );
}
```

### 3. 判断类型

```js
/** 
* @desc 判断类型
* @param {any} 任意类型
* @return {string} 返回判断后类型值
*/ 
export function typeOf(target) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(target)];
}
```



### 3. 深拷贝

```js
/**
* @desc 深拷贝
* @param {any} 任意数据类型
* @return {any} 返回深拷贝后的数据 
*/
export function deepCopy (data) {
  const t = typeOf(data);
  let o;

  if (t === 'array') {
    o = [];
  } else if (t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if (t === 'object') {
    for (const i in data) {
      o[i] = deepCopy(data[i]);
    }
  }
  return o;
}
```

### 4. 获取滚动条宽度

```js
/**
* @desc 获取浏览器滚动条尺寸
* @return {number} 滚动条的宽度
*/
let cached
export function getScrollBarSize (fresh) {
    if (fresh || cached === undefined) {
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        document.body.removeChild(outer)

        cached = widthContained - widthScroll
    }
    return cached
}
```

### 5. js获取服务器时间

```js
/**
*	@desc 获取服务器时间
* @return {date} 日期对象
*/
export function getNowDate(){
  let xhr = null;
  if(window.XMLHttpRequest){
    xhr = new window.XMLHttpRequest();
  }else{
    xhr = new ActiveObject("Microsoft")
  }

  xhr.open("GET","/",false);
  xhr.send(null);
  let date = xhr.getResponseHeader("Date");
  date = new Date(date);
  return date;
}

```

### 6. 下载(不需要使用token)

```js
/**
* @desc 下载方法
* @param {string} 下载地址
*/
export function download(url) {
    const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    if (isChrome || isSafari) {
        const link = document.createElement('a');
        link.href = url;
        if (link.download !== undefined) {
            const fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
            link.download = fileName;
        }
        if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }
    if (url.indexOf('?') === -1) {
        url += '?download';
    }
    window.open(url, '_self');
    return true;
}
```

### 7. js下载(需token鉴权)

```js
/**
* @desc 下载方法(token鉴权)
* @param {string} 下载地址
*/
export const download = async (url) => {
  const response = await axios.get('/download/fileA', {headers: {Authorization: 'Token xxxxxx'}});
  const blob = new Blob([response], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = [fileName];
  a.click();
  window.URL.revokeObjectURL(url);
}
```



### 8. js实现一键复制

```js
/**
*	@desc js实现复制功能
* @param {number | string} 复制的内容
* @return {} 
*/
export function copyCode(txt) {
    const message = txt;
    const input = document.createElement("input");
    input.value = message;
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
    document.body.removeChild(input);
}
```

