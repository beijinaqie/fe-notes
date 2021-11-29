+ 设置当前html文件的字符编码

```html
<meta charset="UTF-8">
```

+ 设置浏览器的兼容模式（让IE使用最新的浏览器渲染）

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
```

+ 视口（快捷键：meta:vp）

```html
<meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"/>
```

**tips:**
作用：在移动浏览器中，当页面宽度超出设备，浏览器内部虚拟的一个页面容器，将页面容器缩放到设备那么大展示；
视口的宽度可以通过meta标签设置；
此属性为移动端页面视口设置；

1. width：视口的宽度，width=device-width：宽度是设备的宽度
2. initial-scale：初始化缩放，- initial-scale=1.0：不缩放
3. user-scalable：是否允许用户自行缩放，取值0或1，yes或no
4. minimum-scale：最小缩放
5. maximum-scale：最大缩放
   一般设置了不允许缩放，就没必要设置最大最小缩放了。

+ Cache-Control头域

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
```

**tips:**

1. Cache-Control指定请求和响应遵循的缓存机制。在请求消息或响应消息中设置Cache-Control并不会修改另一个消息处理过程中的缓存处理过程。请求时的缓存指令包括no-cache、no-store、max-age、max-stale、min-fresh、only-if-cached，响应消息中的指令包括public、private、no-cache、no-store、no-transform、must-revalidate、proxy-revalidate、max-age。各个消息中的指令含义如下,
2. no-cache指示请求或响应消息不能缓存
3. no-store用于防止重要的信息被无意的发布。在请求消息中发送将使得请求和响应消息都不使用缓存
4. must-revalidate：告诉浏览器、缓存服务器，本地副本过期前，可以使用本地副本；本地副本一旦过期，必须去源服务器进行有效性校验。

+ 是用于设定禁止浏览器从本地机的缓存中调阅页面内容，设定后一旦离开网页就无法从Cache中再调出

```html
<meta http-equiv="Pragma" content="no-cache"/>
```



+ 禁止将页面中的一连串数字识别为电话号码、并设置为手机可以拨打的一个连接。这个标签的默认值是telephone=yes

```html
<meta name="format-detection" content="telphone=no, email=no" />
```



+ 删除默认的苹果工具栏和菜单栏。当我们需要显示工具栏和菜单栏时，这个行meta就不用加了，默认就是显示。

```html
<meta content="yes" name="apple-mobile-web-app-capable"/>
```



+ 控制状态栏显示样式。content设置状态栏颜色

```html
<meta content="black" name="apple-mobile-web-app-status-bar-style"/>
```



+ 条件注释

  ```html
  <!--[if lt IE 9]> 
  <script src="lib/html5shiv/html5shiv.min.js"></script> 
  <script src="lib/respond/respond.min.js"></script> 
  <![endif]--> 
  ```

 **tips:**

1. html5shiv让浏览器可以识别html5的新标签；
2.  respond让低版本浏览器可以使用CSS3的媒体查询。







<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<meta content="telephone=no" name="format-detection">
















