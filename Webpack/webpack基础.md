[toc]

# webpack的概念

## css-loader

 解析@import和url，css文件经webpack处理后会成为一下模样

```css
// public.css
.rect{
    background-color: red;
    width: 100px;
    height: 100px;
}
```

```js
import css from './public.css';

console.log(css);
```



![](https://upload-images.jianshu.io/upload_images/10812004-1db169a3934ed1c8.png?imageMogr2/auto-orient/strip|imageView2/2/w/567/format/webp)

很明显，css-loader处理后的文件我们是无法直接使用的，当然我们可以手动创建一个style标签来进行动态引入

```js
import css from './public.css';

let body = document.getElementsByTagName("body")[0];
let style = document.createElement("style");
style.innerText = css[0][1];
body.appendChild(style);
```

但是这样也未免太过于繁琐，因此才有了style-loader来帮助我们处理这些事情。

## style-loader 

style-loader的作用就是将上面的繁琐的步骤交给代码来完成

## node-sass

node-sass是一个库，它将Node.js绑定到LibSass（流行样式表预处理器Sass的C版本）。它允许用户以令人难以置信的速度将.scss文件本地编译为css，并通过连接中间件自动编译。

## postcss

把 CSS 解析成 JavaScript 可以操作的 抽象语法树结构（Abstract Syntax Tree，AST），调用插件来处理 AST 并得到结果

### autoprefixer

为代码增加浏览器兼容前缀

### cssnano

压缩css代码

## file-loader

file-loader 可以指定要复制和放置资源文件的位置，以及如何使用版本哈希命名以获得更好的缓存。此外，这意味着 你可以就近管理图片文件，可以使用相对路径而不用担心部署时 URL 的问题。使用正确的配置，webpack 将会在打包输出中自动重写文件路径为正确的 URL。

## url-loader

url-loader 允许你有条件地将文件转换为内联的 base-64 URL (当文件小于给定的阈值)，这会减少小文件的 HTTP 请求数。如果文件大于该阈值，会自动的交给 file-loader 处理。

loader的执行顺序，正常情况是按照数组的顺序执行，但是 如果想要调整执行的顺序，可以加以下参数enfore: post(后置)、inline(行内)、normal(正常)、pre(前置)，俗称厚脸挣钱

```js
[
  {
    test: /\.js$/,
    use: 'loader'
  },
  {
    test: /\.js$/,
    use: 'loader'
  },
  {
    test: /\.js$/,
    use: 'loader'
  },
]
```

## devtool

+ eveal 

使用eveal包裹代码

+ source-map

产生.map调试文件

+ cheap

不包含列信息，也不包含loader的sourceMap

+ module

包含loader的sourceMap，否则无法定义源文件

+ inline

将.map作为dataUrl嵌入，不单独生成map文件

### eveal

使用eveal包裹模块代码

### source-map

会生成源文件到loader转换后文件的映射信息，也会生成loader转换后文件到webpack打包后文件的映射信息，映射明细具体到行和列。

这种方式报错信息能找到源文件第几行第几列报错。

![](/Users/beijinaqie/笔记/fe-notes/images/source-map.png)

### cheap-source-map

不会生成源文件到loader转换后文件的映射信息，只会具体到行，不会到列。这种方式报错信息只能找到loader转换后文件的第几行报错。

![](/Users/beijinaqie/笔记/fe-notes/images/cheap-source-map.png)

## watch

是否实时打包，就是监听文件变化后就会执行run build

## watchOptions

### aggregateTimeout

防抖，多少秒之后在执行打包，单位毫秒

### ignored

忽略掉打包的文件

### poll

如果监听失效，则采用轮询方式检查文件变化，单位毫秒

### followSymlinks

使用短链接查找文件