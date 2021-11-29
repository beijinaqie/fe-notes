# babel核心

Babel工作原理本质上就是三个步骤：解析、转换、输出，如下👇所示，

![](https://segmentfault.com/img/remote/1460000040174870)

- 解析阶段主要进行词法和语法解析，生成AST语法树，主要由`@babel/parser`完成；解析引擎为`babyIon`
- 转换阶段将AST语法树转换为**目标的AST语法树**，主要由`@babel/traverse`完成；
- 生成阶段将**目标语法树**生成最终代码，主要由`@babel/generator`完成；

1. @babel/parser 将源代码解析成 AST。
2. @babel/generator 将AST解码生 js代码。
3. @babel/core 包括了整个babel工作流，也就是说在@babel/core里面我们会使用到@babel/parser、transformer[s]、以及@babel/generator。
4. @babel/code-frame 用于生成错误信息并且打印出错误原因和错误行数。（其实就是个console工具类）
5. @babel/helpers 也是工具类，提供了一些内置的函数实现，主要用于babel插件的开发。
6. @babel/runtime 也是工具类，但是是为了babel编译时提供一些基础工具库。作用于transformer[s]阶段，当然这是一个工具库，如果要使用这个工具库，还需要引入@babel/plugin-transform-runtime，它才是transformer[s]阶段里面的主角。
7. @babel/template 也是工具类，主要用途是为parser提供模板引擎，更加快速的转化成AST
8. @babel/traverse 也是工具类，主要用途是来便利AST树，也就是在@babel/generator过程中生效。
9. @babel/types 也是工具类，主要用途是在创建AST的过程中判断各种语法的类型。

## babel-loader

babel-loader 是webpack和babel之前的桥梁，配置对应的plugins去结合babel将ES6+语法转译成ES5语法。webpack通过babel-loader拥有了调用babel的能力，使用@babel-core来解析js代码为AST，接着就会对代码进行转换，这个时候通过plugin对输出的AST进行干涉，转换新的AST，最后将AST生成新的es5代码。

## @babel/cli

Babel 自带了一个内置的 CLI 命令行工具，可通过命令行编译文件。其底层依然使用@babel/core，如果需要使用请连@babel/core一并安装。

## @babel/core

babel的核心工具包。他会在babel的整个工作流程中调用对应的插件来工作。@babel/core本身不具备转换处理的功能，它把转换的功能拆分到一个个插件（plugins）中；因此当我们不添加任何插件的时候，输入输出代码是相同的。

```js
var babelCore = require("@babel/core");
var sourceCode = `let fn = (num) => num + 2`;

var options = {
  //是否生成解析的代码
  code: true,
  //是否生成抽象语法树
  ast: true,
  //是否生成sourceMap
  sourceMaps: true,
  plugins: [],
  presets: [],
};

babelCore.transform(sourceCode, options, function (err, result) {
  console.log(sourceCode); // 源代码
  console.log(result.code); // 转换后代码
  console.log(result.map); // source map
  console.log(result.ast); // ast语法树
});


```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3812f7af494e4d45ac477992b9bc1ed6~tplv-k3u1fbpfcp-watermark.awebp)

## @babel/preset-env

babel的预设，将es6，es7等高es版本转成es5版本，其内部就是若干个高版本语法转低版本语法的plugin集合

## babel插件

babel插件即是将高版本语法转化为低版本语法，每个版本对应一个插件。

