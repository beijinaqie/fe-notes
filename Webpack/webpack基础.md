[toc]

# webpack的概念

webpack主要有三个功能

## 模块依赖问题

通过加载入口文件以及入口文件依赖文件进行递归加载，将所有文件进行打包编译然后进行输出

## webpack不识别特殊资源问题

webpack本身只识别js或者json文件，通过配置loader来解决诸如jsx，js，png，txt，less，scss等文件

## 打包过程添加附加产物

webpack打包编译过程中会广播一系列事件，插件开发者可以根据需求订阅对应的hook事件进行更改webpack的输出产物



# webpack plugins



![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/066bd24610954b63b3ff8a42b65fd965~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

插件是 webpack 的重要组成部分，为用户提供了一种强大方式来直接触及 webpack 的编译过程(compilation process)。插件能够 [钩入(hook)](https://link.juejin.cn?target=https%3A%2F%2Fwww.webpackjs.com%2Fapi%2Fcompiler-hooks%2F%23hooks) 到在每个编译(compilation)中触发的所有关键事件。在编译的每一步，插件都具备完全访问 `compiler` 对象的能力，如果情况合适，还可以访问当前 `compilation` 对象。

### 插件基本结构

一个简单的插件结构如下：

```javascript
class ExamplePlugin {

  constructor(options) {}

  apply(compiler) {
  	compiler.hooks.emit.tapAsync("ExamplePlugin", (compilation, callback) => {
      console.log("This is an ExamplePlugin")
      callback();
    })
  }
}
复制代码
```

在使用这个插件时，在 webpack 中的配置如下：

```ini
const ExamplePlugin = require('./ExamplePlugin.js');

module.exports = {
    plugins: [
    new ExamplePlugin(options)
  ]
}
复制代码
```

从上面的插件结构中，我们可以知道，一个 webpack 插件一般由以下几部分组成：

- 一个ES6 class 类
- 在类中定义一个 apply 方法
- 指定一个绑定到 webpack 自身的事件钩子
- 处理 webpack 内部实例的特定数据
- 功能完成后调用 webpack 提供的回调

```javascript
// 一个 class 类 （class 的本质就是一个函数）
class ExamplePlugin {

  constructor(options) {}

  // 在类中定义一个 apply 方法（本质上就是在 函数的prototype 上定义）
  apply(compiler) {
    // 指定一个挂载到 webpack 自身的事件钩子。 emit 就是 webpack 自身的事件钩子
    compiler.hooks.emit.tapAsync("ExamplePlugin", (compilation /* 处理 webpack 内部实例的特定数据 */, callback) => {
      console.log("This is an exanple plugin !!!")
      // 功能完成后调用 webpack 提供的回调
      callback();
    })
  }
}
复制代码
```

webpack 启动后，在读取配置的过程中会先执行 new ExamplePlugin(options) 初始化一个 ExamplePlugin 实例。在初始化 compiler 对象后，再调用 examplePlugin.apply(compiler) 给插件实例传入 compiler 对象。插件实例在获取到 compiler 对象后，就可以通过 compiler.plugin(evenName, callback) 监听到 webpack 广播出的事件，并且可以通过 compiler 对象去操作 webpack。

### compiler 和 compilation

在开发 plugins 时最常用的就是 compiler 和 compilation 对象。它们是 plugins 和 webpack 之间的桥梁。

#### compiler

compiler 对象包含了 webpack 环境所有的配置信息，包括 options、loaders、plugins 这些信息，这个对象在 webpack 启动的时候被实例化，它是全局唯一的，可以简单地把它理解为 webpack 实例。

#### compilation

compilation 对象代表了一次资源版本的构建。它包含了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息等。当 webpack 以开发模式运行时，每当检测到一个变化，一次新的 compilation 将被创建。compilation 对象也提供了很多事件回调供插件做扩展。通过 compilation 也可以读取到 compiler 对象。

### Tapable

tapable 是 webpack 的一个核心工具，它暴露了 tap、tapAsync、tapPromise 方法，可以使用这些方法来触发 compiler 钩子，使得插件可以监听 webpack 在运行过程中广播的事件，然后通过 compiler 对象去操作 webpack。我们也可以使用这些方法注入自定义的构建步骤，这些步骤将在整个编译过程中的不同时机触发。

- tap：以**同步方式**触发 compiler 钩子
- tapAsync：以**异步方式**触发 compiler 钩子
- tapPromise：以**异步方式**触发 compiler 钩子，返回 Promise

### 如何编写插件

接下来，我们实现一个打包清单插件，我们给该插件取名叫 FileListWebpackPlugin 。其作用是在 webpack 生成资源到 output 目录之前创建一个 fileList.txt 文件，该文件用于统计打包后 bundle 文件的数量、文件的大小及其名称等信息。

要实现该插件，我们需要借助 emit 事件，并借助 tapable 暴露的 tapAsync 方法来触发 emit 事件。

下面，我们逐步来实现该插件。

#### 1、初始化插件文件

新建 fileList-txt-webpack-plugin.js 文件，根据插件的基本机构，初始化插件代码：

```javascript
module.exports = class FileListTxtWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListTxtWebpackPlugin', (compilation, callback) => {
      console.log('This is a FileListTxtWebpackPlugin !!!');
        callback();
    })
  }
}
复制代码
```

apply 方法为插件原型方法，接收 compiler 作为参数，用于帮助插件注册。

#### 2、选择插件触发时机

选择插件触发时机，其实就是选择插件触发的 compiler 钩子，即在哪个阶段触发插件。我们编写的插件，需要在 webpack 生成资源到 output 目录之前触发，也就是要触发 compiler 的 emit 钩子。emit 是一个异步钩子函数，因此需要使用 tapAsync 方法来触发。

tapAsync 会以异步的方式触发 compiler 钩子，它接受两个参数，插件名称和回调函数。插件名称是我们自己定义的，我们通常将其与实现插件的类的名称保持一致。回调函数接受两个参数，compilation 对象 和 callback，在处理完 webpack 内部实例的特定数据后， callback 必须被调用。

```javascript
module.exports = class FileListTxtWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // 使用 tapAsync 触发 emit 钩子
    // FileListTxtWebpackPlugin 是我们自定义的插件名称，我们将其与类名保持一致
    compiler.hooks.emit.tapAsync('FileListTxtWebpackPlugin', (compilation, callback) => {

      // 处理webpack 内部实例的特定是数据（从 compilation 对象中获取）

      // callback 必须被调用
        callback();
    })
  }
}
复制代码
```

#### 3、编写插件逻辑

在这一步，我们开始编写插件的逻辑。

tapAsync 方法的第二个参数是一个回调函数，它接受两个参数，compilation 和 callback 。compilation 继承自 compiler ，它包含了当前的模块资源、编译生成资源、变化的文件等，也就是说我们需要统计的 bundle 文件都可以从 compilation 对象中获取到。

```javascript
module.exports = class FileListTxtWebpackPlugin {
    // apply函数 帮助插件注册，接收complier类
    constructor(options) {
        console.log(options);
        // webpack 中配置的 options 对象
        this.options = options
    }

    apply(complier) {

        // 异步的钩子
        complier.hooks.emit.tapAsync("FileListTxtWebpackPlugin", (compilation, callback) => {

            const fileDependencies = [...compilation.fileDependencies]
            // 打包后 dist 目录下的文件资源都放在 assets 对象中
            const assets = compilation.assets
            // 定义返回文件的内容
            let fileContent = `文件数量：${Object.keys(assets).length}\n文件列表：`
            Object.keys(assets).forEach(item => {
                // 文件的源内容
                const source = assets[item].source();
                // 文件的大小
                let size = assets[item].size()
                size = size >= 1024 ? `${(size / 1024).toFixed(2)}/kb` : `${size}/bytes`;

                // 文件路径
                const sourcepath = fileDependencies.find(path => {
                    if (path.includes(item)) return path
                }) || ''
                fileContent = `${fileContent}\n  filename: ${item}    size: ${size}    sourcepath: ${sourcepath}`
            })

            // 添加自定义输出文件
            compilation.assets["fileList.txt"] = {
                source: function () {
                    // 定义文件的内容
                    return fileContent
                },
                size: function () {
                    // 定义文件的体积
                    return Buffer.byteLength(fileContent, 'utf8');
                },
            };
            // 注意，异步钩子中 callback 函数必须要调用
            callback();
        });

    }
}
复制代码
```

#### 4、使用插件

我们的插件编写完成之后，就可以使用了，其使用方式与其它插件一致，在 webpack.config.js 中的 plugins 数组中实例化：

```ini
const fileListTxtWebpackPlugin = require("./myPlugins/fileList-txt-webpack-plugin");

module.exports = {

    // ... 省略其它配置

    plugins: [
    // ... 省略其它插件

    new fileListTxtWebpackPlugin()
  ]
}
复制代码
```

## 总结

webpack 通过 plugin 机制让其更加灵活，以适应各种应用场景。在 webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。因此，在编写一个插件的时候，找到合适的事件点去完成功能在开发插件时是十分重要的。

https://juejin.cn/post/6893097741258326030

# webpack loader

小技巧

pitch函数会阻止当前loader的noamal函数以及后续loader进行，直接返回上一个loader

在pitch函数里可以拿到后续loader，通过require来加载内联loader来执行被pitch阻止的loader，切记`!!`代表仅使用内联loader

![img](https://segmentfault.com/img/remote/1460000040146133)

那么，我们开始吧。

## 认识 Loader

> 如果要做总结的话，我认为 Loader 是一个带有副作用的内容转译器！

Webpack Loader 最核心的只能是实现内容转换器 —— 将各式各样的资源转化为标准 JavaScript 内容格式，例如：

- `css-loader` 将 css 转换为 `__WEBPACK_DEFAULT_EXPORT__ = ".a{ xxx }"` 格式
- `html-loader` 将 html 转换为 `__WEBPACK_DEFAULT_EXPORT__ = "<!DOCTYPE xxx"` 格式
- `vue-loader` 更复杂一些，会将 `.vue` 文件转化为多个 JavaScript 函数，分别对应 template、js、css、custom block

那么为什么需要做这种转换呢？本质上是因为 Webpack 只认识符合 JavaScript 规范的文本(Webpack 5之后增加了其它 parser)：在构建(make)阶段，解析模块内容时会调用 `acorn` 将文本转换为 AST 对象，进而分析代码结构，分析模块依赖；这一套逻辑对图片、json、Vue SFC等场景就不 work 了，就需要 Loader 介入将资源转化成 Webpack 可以理解的内容形态。

> Plugin 是 Webpack 另一套扩展机制，功能更强，能够在各个对象的钩子中插入特化处理逻辑，它可以覆盖 Webpack 全生命流程，能力、灵活性、复杂度都会比 Loader 强很多。

### Loader 基础

代码层面，Loader 通常是一个函数，结构如下：

```bash
module.exports = function(source, sourceMap?, data?) {
  // source 为 loader 的输入，可能是文件内容，也可能是上一个 loader 处理结果
  return source;
};
```

Loader 函数接收三个参数，分别为：

- `source`：资源输入，对于第一个执行的 loader 为资源文件的内容；后续执行的 loader 则为前一个 loader 的执行结果
- `sourceMap`: 可选参数，代码的 [sourcemap](https://link.segmentfault.com/?enc=2SNllQVZE84ILmk3Ze6W%2FA%3D%3D.QRkW8HLPWVdYH%2BCUraSbUeHiAYmlaDpZffh84Q1V5Po%3D) 结构
- `data`: 可选参数，其它需要在 Loader 链中传递的信息，比如 [posthtml/posthtml-loader](https://link.segmentfault.com/?enc=77H%2F3l9ldKBMhVOeIabnNw%3D%3D.NKM%2BEBBXKkwWKhZGoMiUThPRQkxaT4aNUqOIuzetcjgnBP59PzAiUpwEjU0l05Pt) 就会通过这个参数传递参数的 AST 对象

其中 `source` 是最重要的参数，大多数 Loader 要做的事情就是将 `source` 转译为另一种形式的 `output` ，比如 [webpack-contrib/raw-loader](https://link.segmentfault.com/?enc=vxp6Pt07ntoXu2RXKRtCyw%3D%3D.0VVW5Qa8QJwwbMmODlKHE15CzkPc7jawtClk%2B5h5tbfYZ7aparlkd0FJtW8XSus1) 的核心源码：

```javascript
//... 
export default function rawLoader(source) {
  // ...

  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;

  return `${esModule ? 'export default' : 'module.exports ='} ${json};`;
}
```

这段代码的作用是将文本内容包裹成 JavaScript 模块，例如：

```awk
// source
I am Tecvan

// output
module.exports = "I am Tecvan"
```

经过模块化包装之后，这段文本内容转身变成 Webpack 可以处理的资源模块，其它 module 也就能引用、使用它了。

### 返回多个结果

上例通过 `return` 语句返回处理结果，除此之外 Loader 还可以以 `callback` 方式返回更多信息，供下游 Loader 或者 Webpack 本身使用，例如在 [webpack-contrib/eslint-loader](https://link.segmentfault.com/?enc=mONn%2FzCU3RdpmU%2B6K%2BhvCg%3D%3D.X6nrKOJHxtJ3fvfTpxnAfNdm0HEgaWj%2Feb1ODZLswkRJG4IW1zAmG59amETMy6TSlZ5QHiNtNO630ZFCNsiBGQ%3D%3D) 中：

```javascript
export default function loader(content, map) {
  // ...
  linter.printOutput(linter.lint(content));
  this.callback(null, content, map);
}
```

通过 `this.callback(null, content, map)` 语句同时返回转译后的内容与 sourcemap 内容。`callback` 的完整签名如下：

```javascript
this.callback(
    // 异常信息，Loader 正常运行时传递 null 值即可
    err: Error | null,
    // 转译结果
    content: string | Buffer,
    // 源码的 sourcemap 信息
    sourceMap?: SourceMap,
    // 任意需要在 Loader 间传递的值
    // 经常用来传递 ast 对象，避免重复解析
    data?: any
);
```

### 异步处理

涉及到异步或 CPU 密集操作时，Loader 中还可以以异步形式返回处理结果，例如 [webpack-contrib/less-loader](https://link.segmentfault.com/?enc=nn7tEtK6kD%2BgbHgu9UIkPg%3D%3D.TKAeiQ1gFdPx6JZ2k%2FFhVeduru%2FzGVaakMJCJpVYZZP4IDRss8fKCcbkKzUyaiE%2B) 的核心逻辑：

```javascript
import less from "less";

async function lessLoader(source) {
  // 1. 获取异步回调函数
  const callback = this.async();
  // ...

  let result;

  try {
    // 2. 调用less 将模块内容转译为 css
    result = await (options.implementation || less).render(data, lessOptions);
  } catch (error) {
    // ...
  }

  const { css, imports } = result;

  // ...

  // 3. 转译结束，返回结果
  callback(null, css, map);
}

export default lessLoader;
```

在 less-loader 中，逻辑分三步：

- 调用 `this.async` 获取异步回调函数，此时 Webpack 会将该 Loader 标记为异步加载器，会挂起当前执行队列直到 `callback` 被触发
- 调用 `less` 库将 less 资源转译为标准 css
- 调用异步回调 `callback` 返回处理结果

`this.async` 返回的异步回调函数签名与上一节介绍的 `this.callback` 相同，此处不再赘述。

### 缓存

Loader 为开发者提供了一种便捷的扩展方法，但在 Loader 中执行的各种资源内容转译操作通常都是 CPU 密集型 —— 这放在单线程的 Node 场景下可能导致性能问题；又或者异步 Loader 会挂起后续的加载器队列直到异步 Loader 触发回调，稍微不注意就可能导致整个加载器链条的执行时间过长。

为此，默认情况下 Webpack 会缓存 Loader 的执行结果直到资源或资源依赖发生变化，开发者需要对此有个基本的理解，必要时可以通过 `this.cachable` 显式声明不作缓存，例如：

```javascript
module.exports = function(source) {
  this.cacheable(false);
  // ...
  return output;
};
```

### 上下文与 Side Effect

除了作为内容转换器外，Loader 运行过程还可以通过一些上下文接口，有限制地影响 Webpack 编译过程，从而产生内容转换之外的副作用。

上下文信息可通过 `this` 获取，`this` 对象由 `NormolModule.createLoaderContext` 函数在调用 Loader 前创建，常用的接口包括：

```javascript
const loaderContext = {
    // 获取当前 Loader 的配置信息
    getOptions: schema => {},
    // 添加警告
    emitWarning: warning => {},
    // 添加错误信息，注意这不会中断 Webpack 运行
    emitError: error => {},
    // 解析资源文件的具体路径
    resolve(context, request, callback) {},
    // 直接提交文件，提交的文件不会经过后续的chunk、module处理，直接输出到 fs
    emitFile: (name, content, sourceMap, assetInfo) => {},
    // 添加额外的依赖文件
    // watch 模式下，依赖文件发生变化时会触发资源重新编译
    addDependency(dep) {},
};
```

其中，`addDependency`、`emitFile` 、`emitError`、`emitWarning` 都会对后续编译流程产生副作用，例如 `less-loader` 中包含这样一段代码：

```javascript
  try {
    result = await (options.implementation || less).render(data, lessOptions);
  } catch (error) {
    // ...
  }

  const { css, imports } = result;

  imports.forEach((item) => {
    // ...
    this.addDependency(path.normalize(item));
  });
```

解释一下，代码中首先调用 `less` 编译文件内容，之后遍历所有 `import` 语句，也就是上例 `result.imports` 数组，一一调用 `this.addDependency` 函数将 import 到的其它资源都注册为依赖，之后这些其它资源文件发生变化时都会触发重新编译。

## Loader 链式调用

使用上，可以为某种资源文件配置多个 Loader，Loader 之间按照配置的顺序从前到后(pitch)，再从后到前依次执行，从而形成一套内容转译工作流，例如对于下面的配置：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
};
```

这是一个典型的 less 处理场景，针对 `.less` 后缀的文件设定了：less、css、style 三个 loader 协作处理资源文件，按照定义的顺序，Webpack 解析 less 文件内容后先传入 less-loader；less-loader 返回的结果再传入 css-loader 处理；css-loader 的结果再传入 style-loader；最终以 style-loader 的处理结果为准，流程简化后如：

![img](https://segmentfault.com/img/remote/1460000040146134)

上述示例中，三个 Loader 分别起如下作用：

- `less-loader`：实现 less => css 的转换，输出 css 内容，无法被直接应用在 Webpack 体系下
- `css-loader`：将 css 内容包装成类似 `module.exports = "${css}"` 的内容，包装后的内容符合 JavaScript 语法
- `style-loader`： 做的事情非常简单，就是将 css 模块包进 require 语句，并在运行时调用 injectStyle 等函数将内容注入到页面的 style 标签

三个 Loader 分别完成内容转化工作的一部分，形成从右到左的调用链条。链式调用这种设计有两个好处，一是保持单个 Loader 的单一职责，一定程度上降低代码的复杂度；二是细粒度的功能能够被组装成复杂而灵活的处理链条，提升单个 Loader 的可复用性。

不过，这只是链式调用的一部分，这里面有两个问题：

- Loader 链条一旦启动之后，需要所有 Loader 都执行完毕才会结束，没有中断的机会 —— 除非显式抛出异常
- 某些场景下并不需要关心资源的具体内容，但 Loader 需要在 source 内容被读取出来之后才会执行

为了解决这两个问题，Webpack 在 loader 基础上叠加了 `pitch` 的概念。

## Loader Pitch

网络上关于 Loader 的文章已经有非常非常多，但多数并没有对 `pitch` 这一重要特性做足够深入的介绍，没有讲清楚为什么要设计 pitch 这个功能，pitch 有哪些常见用例等。

在这一节，我会从 what、how、why 三个维度展开聊聊 loader pitch 这一特性。

### 什么是 pitch

Webpack 允许在这个函数上挂载名为 `pitch` 的函数，运行时 pitch 会比 Loader 本身更早执行，例如：

```javascript
const loader = function (source){
    console.log('后执行')
    return source;
}

loader.pitch = function(requestString) {
    console.log('先执行')
}

module.exports = loader
```

Pitch 函数的完整签名：

```javascript
function pitch(
    remainingRequest: string, previousRequest: string, data = {}
): void {
}
```

包含三个参数：

- `remainingRequest` : 当前 loader 之后的资源请求字符串
- `previousRequest` : 在执行当前 loader 之前经历过的 loader 列表
- `data` : 与 Loader 函数的 `data` 相同，用于传递需要在 Loader 传播的信息

这些参数不复杂，但与 requestString 紧密相关，我们看个例子加深了解：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader", "css-loader", "less-loader"
        ],
      },
    ],
  },
};
```

`css-loader.pitch` 中拿到的参数依次为：

```javascript
// css-loader 之后的 loader 列表及资源路径
remainingRequest = less-loader!./xxx.less
// css-loader 之前的 loader 列表
previousRequest = style-loader
// 默认值
data = {}
```

### 调度逻辑

Pitch 翻译成中文是*抛、球场、力度、事物最高点*等，我觉得 pitch 特性之所以被忽略完全是这个名字的锅，它背后折射的是一整套 Loader 被执行的生命周期概念。

实现上，Loader 链条执行过程分三个阶段：pitch、解析资源、执行，设计上与 DOM 的事件模型非常相似，pitch 对应到捕获阶段；执行对应到冒泡阶段；而两个阶段之间 Webpack 会执行资源内容的读取、解析操作，对应 DOM 事件模型的 AT\_TARGET 阶段：

![img](https://segmentfault.com/img/remote/1460000040146135)

`pitch` 阶段按配置顺序从左到右逐个执行 `loader.pitch` 函数(如果有的话)，开发者可以在 `pitch` 返回任意值中断后续的链路的执行：

![img](https://segmentfault.com/img/remote/1460000040146136)

那么为什么要设计 pitch 这一特性呢？在分析了 style-loader、vue-loader、to-string-loader 等开源项目之后，我个人总结出两个字：**阻断**！

### 示例：style-loader

先回顾一下前面提到过的 less 加载链条：

- `less-loader` ：将 less 规格的内容转换为标准 css
- `css-loader` ：将 css 内容包裹为 JavaScript 模块
- `style-loader` ：将 JavaScript 模块的导出结果以 `link` 、`style` 标签等方式挂载到 html 中，让 css 代码能够正确运行在浏览器上

实际上， `style-loader` 只是负责让 css 能够在浏览器环境下跑起来，本质上并不需要关心具体内容，很适合用 pitch 来处理，核心代码：

```javascript
// ...
// Loader 本身不作任何处理
const loaderApi = () => {};

// pitch 中根据参数拼接模块代码
loaderApi.pitch = function loader(remainingRequest) {
  //...

  switch (injectType) {
    case 'linkTag': {
      return `${
        esModule
          ? `...`
          // 引入 runtime 模块
          : `var api = require(${loaderUtils.stringifyRequest(
              this,
              `!${path.join(__dirname, 'runtime/injectStylesIntoLinkTag.js')}`
            )});
            // 引入 css 模块
            var content = require(${loaderUtils.stringifyRequest(
              this,
              `!!${remainingRequest}`
            )});

            content = content.__esModule ? content.default : content;`
      } // ...`;
    }

    case 'lazyStyleTag':
    case 'lazySingletonStyleTag': {
        //...
    }

    case 'styleTag':
    case 'singletonStyleTag':
    default: {
        // ...
    }
  }
};

export default loaderApi;
```

关键点：

- `loaderApi` 为空函数，不做任何处理
- `loaderApi.pitch` 中拼接结果，导出的代码包含：
  - 引入运行时模块 `runtime/injectStylesIntoLinkTag.js`
  - 复用 `remainingRequest` 参数，重新引入 css 文件

运行结果大致如：

```javascript
var api = require('xxx/style-loader/lib/runtime/injectStylesIntoLinkTag.js')
var content = require('!!css-loader!less-loader!./xxx.less');
```

注意了，到这里 style-loader 的 pitch 函数返回这一段内容，后续的 Loader 就不会继续执行，当前调用链条中断了：

![img](https://segmentfault.com/img/remote/1460000040146137)

之后，Webpack 继续解析、构建 style-loader 返回的结果，遇到 inline loader 语句：

```javascript
var content = require('!!css-loader!less-loader!./xxx.less');
```

所以从 Webpack 的角度看，实际上对同一个文件调用了两次 loader 链，第一次在 style-loader 的 pitch 中断，第二次根据 inline loader 的内容跳过了 style-loader。

相似的技巧在其它仓库也有出现，比如 vue-loader，感兴趣的同学可以查看我之前发在 ByteFE 公众号上的文章《[Webpack 案例 ——vue-loader 原理分析](https://link.segmentfault.com/?enc=s2Z%2BbcxSmagMgEXcDlotjQ%3D%3D.D7He4tc%2F9OyWF8WixKGzLOiiiUP%2FNft%2BFRUIopdOxgsWoehsJ2hyq4%2Bf5lL2QOUmfi%2BBx7U2OuY4z0O1BiGRiw%3D%3D)》，这里就不展开讲了。

## 进阶技巧

### 开发工具

Webpack 为 Loader 开发者提供了两个实用工具，在诸多开源 Loader 中出现频率极高：

- [webpack/loader-utils](https://link.segmentfault.com/?enc=9Bltgfi9PHUIwsD21D2V3g%3D%3D.BEhR6SD%2Bn1wN2wIhYvMf2V3tct3k%2BoB532YxwwrzskccP2aZW5EepWdZK5kY5qzP)：提供了一系列诸如读取配置、requestString 序列化与反序列化、计算 hash 值之类的工具函数
- [webpack/schema-utils](https://link.segmentfault.com/?enc=j7rqo0imeH2i3Zunffshtg%3D%3D.W328Bs2CZ%2B1BxkdCCoz7XcMVeG5k0%2BsOe20GBkuwcGZR6Igd%2B6Y0cd2dN32cs86w)：参数校验工具

这些工具的具体接口在相应的 readme 上已经有明确的说明，不赘述，这里总结一些编写 Loader 时经常用到的样例：如何获取并校验用户配置；如何拼接输出文件名。

#### 获取并校验配置

Loader 通常都提供了一些配置项，供开发者定制运行行为，用户可以通过 Webpack 配置文件的 `use.options` 属性设定配置，例如：

```javascript
module.exports = {
  module: {
    rules: [{
      test: /\.less$/i,
      use: [
        {
          loader: "less-loader",
          options: {
            cacheDirectory: false
          }
        },
      ],
    }],
  },
};
```

在 Loader 内部，需要使用 `loader-utils` 库的 `getOptions` 函数获取用户配置，用 `schema-utils` 库的 `validate` 函数校验参数合法性，例如 css-loader：

```javascript
// css-loader/src/index.js
import { getOptions } from "loader-utils";
import { validate } from "schema-utils";
import schema from "./options.json";


export default async function loader(content, map, meta) {
  const rawOptions = getOptions(this);

  validate(schema, rawOptions, {
    name: "CSS Loader",
    baseDataPath: "options",
  });
  // ...
}
```

使用 `schema-utils` 做校验时需要提前声明配置模板，通常会处理成一个额外的 json 文件，例如上例中的 `"./options.json"`。

#### 拼接输出文件名

Webpack 支持以类似 `[path]/[name]-[hash].js` 方式设定 `output.filename` 即输出文件的命名，这一层规则通常不需要关注，但某些场景例如 [webpack-contrib/file-load](https://link.segmentfault.com/?enc=6vhN9PesfSKHxU6vPEI%2FQg%3D%3D.4OlcUdbOV2uRPJKwLUsoQpkR4qkUyd9ydJZzPWd6tfUPm8iczYoLCfL1MhEeWLQw)[er](https://link.segmentfault.com/?enc=GEZ7J7iWR4CXVbmfpCuEFQ%3D%3D.VkB08Y%2B3PPHnjBNTv4lJOer78ndO0MwkeACkzg3AajlXl9cgxyFjxqZAJikjMP67) 需要根据 asset 的文件名拼接结果。

`file-loader` 支持在 JS 模块中引入诸如 png、jpg、svg 等文本或二进制文件，并将文件写出到输出目录，这里面有一个问题：假如文件叫 `a.jpg` ，经过 Webpack 处理后输出为 `[hash].jpg` ，怎么对应上呢？此时就可以使用 `loader-utils` 提供的 `interpolateName` 在 `file-loader` 中获取资源写出的路径及名称，源码：

```javascript
import { getOptions, interpolateName } from 'loader-utils';

export default function loader(content) {
  const context = options.context || this.rootContext;
  const name = options.name || '[contenthash].[ext]';

  // 拼接最终输出的名称
  const url = interpolateName(this, name, {
    context,
    content,
    regExp: options.regExp,
  });

  let outputPath = url;
  // ...

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;
  // ...

  if (typeof options.emitFile === 'undefined' || options.emitFile) {
    // ...

    // 提交、写出文件
    this.emitFile(outputPath, content, null, assetInfo);
  }
  // ...

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;

  // 返回模块化内容
  return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
}

export const raw = true;
```

代码的核心逻辑：

1. 根据 Loader 配置，调用 `interpolateName` 方法拼接目标文件的完整路径
2. 调用上下文 `this.emitFile` 接口，写出文件
3. 返回 `module.exports = ${publicPath}` ，其它模块可以引用到该文件路径

除 file-loader 外，css-loader、eslint-loader 都有用到该接口，感兴趣的同学请自行前往查阅源码。

### 单元测试

在 Loader 中编写单元测试收益非常高，一方面对开发者来说不用去怎么写 demo，怎么搭建测试环境；一方面对于最终用户来说，带有一定测试覆盖率的项目通常意味着更高、更稳定的质量。

阅读了超过 20 个开源项目后，我总结了一套 Webpack Loader 场景下常用的单元测试流程，以 [Jest · 🃏 Delightful JavaScript Testing](https://link.segmentfault.com/?enc=iGIEZLuzqhts57JyqXFO0w%3D%3D.khilpuxemXP9sRyDRnN4xsPVrHZ0HZOL81aYTtLqRhg%3D) 为例：

1. 创建在 Webpack 实例，并运行 Loader
2. 获取 Loader 执行结果，比对、分析判断是否符合预期
3. 判断执行过程中是否出错

#### 如何运行 Loader

有两种办法，一是在 node 环境下运行调用 Webpack 接口，用代码而非命令行执行编译，很多框架都会采用这种方式，例如 vue-loader、stylus-loader、babel-loader 等，优点的运行效果最接近最终用户，缺点是运行效率相对较低(可以忽略)。

以 [posthtml/posthtml-loader](https://link.segmentfault.com/?enc=%2FNxzPJ4uSN7rWumIGORwCg%3D%3D.Ow%2BVke9nWJpkXWBEuBrXZiiWNQJRwGlcoFm3wDBqjoK0jzGeLWKjMWJHkGC1GliB) 为例，它会在启动测试之前创建并运行 Webpack 实例：

```javascript
// posthtml-loader/test/helpers/compiler.js 文件
module.exports = function (fixture, config, options) {
  config = { /*...*/ }

  options = Object.assign({ output: false }, options)

  // 创建 Webpack 实例
  const compiler = webpack(config)

  // 以 MemoryFS 方式输出构建结果，避免写磁盘
  if (!options.output) compiler.outputFileSystem = new MemoryFS()

  // 执行，并以 promise 方式返回结果
  return new Promise((resolve, reject) => compiler.run((err, stats) => {
    if (err) reject(err)
    // 异步返回执行结果
    resolve(stats)
  }))
}
```

> 小技巧：
> 如上例所示，用 `compiler.outputFileSystem = new MemoryFS()` 语句将 Webpack 设定成输出到内存，能避免写盘操作，提升编译速度。

另外一种方法是编写一系列 mock 方法，搭建起一个模拟的 Webpack 运行环境，例如 [emaphp/underscore-template-loader](https://link.segmentfault.com/?enc=QmKSLHfJs9N1T1d8OHnZJQ%3D%3D.2XJ0al0UQWIr%2BMlWrMt8NUlZ%2Beg2fYNpLo44IwFTLW2vwdiwsC%2FtWHstjcRtYQrvzQ2527t7B36BT1ZdrNFLwg%3D%3D) ，优点的运行速度更快，缺点是开发工作量大通用性低，了解了解即可。

#### 比对结果

上例运行结束之后会以 `resolve(stats)` 方式返回执行结果，`stats` 对象中几乎包含了编译过程所有信息，包括耗时、产物、模块、chunks、errors、warnings 等等，我在之前的文章 [分享几个 Webpack 实用分析工具](https://link.segmentfault.com/?enc=LVZGPzo25W1F5AN37Mapkg%3D%3D.n444M%2FwgXDRz6y%2BTCur7faVoBx7wujkcmEm459O0LxPz3Zv1k261cGzBSfvO4k4XbzvzD9n5F2TmQuhnqDEZng%3D%3D) 对此已经做了较深入的介绍，感兴趣的同学可以前往阅读。

在测试场景下，可以从 `stats` 对象中读取编译最终输出的产物，例如 style-loader 的实现：

```javascript
// style-loader/src/test/helpers/readAsset.js 文件
function readAsset(compiler, stats, assets) => {
  const usedFs = compiler.outputFileSystem
  const outputPath = stats.compilation.outputOptions.path
  const queryStringIdx = targetFile.indexOf('?')

  if (queryStringIdx >= 0) {
    // 解析出输出文件路径
    asset = asset.substr(0, queryStringIdx)
  }

  // 读文件内容
  return usedFs.readFileSync(path.join(outputPath, targetFile)).toString()
}
```

解释一下，这段代码首先计算 asset 输出的文件路径，之后调用 outputFileSystem 的 `readFile` 方法读取文件内容。

接下来，有两种分析内容的方法：

- 调用 Jest 的 `expect(xxx).toMatchSnapshot()` 断言判断当前运行结果是否与之前的运行结果一致，从而确保多次修改的结果一致性，很多框架都大量用了这种方法
- 解读资源内容，判断是否符合预期，例如 less-loader 的单元测试中会对同一份代码跑两次 less 编译，一次由 Webpack 执行，一次直接调用 `less` 库，之后分析两次运行结果是否相同

对此有兴趣的同学，强烈建议看看 `less-loader` 的 test 目录。

#### 异常判断

最后，还需要判断编译过程是否出现异常，同样可以从 `stats` 对象解析：

```javascript
export default getErrors = (stats) => {
  const errors = stats.compilation.errors.sort()
  return errors.map(
    e => e.toString()
  )
}
```

大多数情况下都希望编译没有错误，此时只要判断结果数组是否为空即可。某些情况下可能需要判断是否抛出特定异常，此时可以 `expect(xxx).toMatchSnapshot()` 断言，用快照对比更新前后的结果。

### 调试

开发 Loader 的过程中，有一些小技巧能够提升调试效率，包括：

- 使用 [ndb](https://link.segmentfault.com/?enc=6ddRy2YrJcrrxlhgDzOhNQ%3D%3D.DbrEhZkI5OXYiSxyrTUAWnwAMtjVhnui6y%2BwuEF2%2BtlsyRS7TKtA7XxQhtRKX%2F%2FF) 工具实现断点调试
- 使用 `npm link` 将 Loader 模块链接到测试项目
- 使用 `resolveLoader` 配置项将 Loader 所在的目录加入到测试项目中，如：

```javascript
// webpack.config.js
module.exports = {
  resolveLoader:{
    modules: ['node_modules','./loaders/'],
  }
}
```

https://segmentfault.com/a/1190000040146131



## webpack配置项



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