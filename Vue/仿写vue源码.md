[toc]

# 开发前的准备配置

## webpack与rollup的区别

webpack与rollup都是模块打包器，区别在于webpack的打包是万物且模块，模块皆可以打包，比如js，css，图片等等，只需要配置好各种loader就行，而rollup则是轻量的js模块打包器。库的开发使用rollup进行开发，应用的开发则使用webpack。

## rollup项目的配置

+ rollup 类比webpack
+ [rollup-plugin-alias](https://link.zhihu.com/?target=https%3A//github.com/rollup/rollup-plugin-alias): 提供 modules 名称的 alias 和 reslove 功能.
+ [rollup-plugin-babel](https://link.zhihu.com/?target=https%3A//github.com/rollup/rollup-plugin-babel): 提供 Babel 能力, 需要安装和配置 Babel (这部分知识不在本文涉及)
+ [rollup-plugin-eslint](https://link.zhihu.com/?target=https%3A//github.com/TrySound/rollup-plugin-eslint): 提供 ESLint 能力, 需要安装和配置 ESLint (这部分知识不在本文涉及)
+ [rollup-plugin-node-resolve](https://link.zhihu.com/?target=https%3A//github.com/rollup/rollup-plugin-node-resolve): 解析 node_modules 中的模块
+ [rollup-plugin-commonjs](https://link.zhihu.com/?target=https%3A//github.com/rollup/rollup-plugin-commonjs): 转换 CJS -> ESM, 通常配合上面一个插件使用
+ [rollup-plugin-replace](https://link.zhihu.com/?target=https%3A//github.com/rollup/rollup-plugin-replace): 类比 Webpack 的 [DefinePlugin](https://link.zhihu.com/?target=https%3A//webpack.js.org/plugins/define-plugin/) , 可在源码中通过 `process.env.NODE_ENV` 用于构建区分 Development 与 Production 环境.
+ [rollup-plugin-filesize](https://link.zhihu.com/?target=https%3A//github.com/ritz078/rollup-plugin-filesize): 显示 bundle 文件大小
+ [rollup-plugin-uglify](https://link.zhihu.com/?target=https%3A//github.com/TrySound/rollup-plugin-uglify): 压缩 bundle 文件
+ rollup-plugin-terser插件：代码压缩，取代uglify，支持ES模块
+ rollup-plugin-replace插件：替换代码中的变量为指定值；
+ rollup-plugin-buble插件：编译ES6+语法为ES2015，无需配置，比babel更轻量；
+ [rollup-plugin-serve](https://link.zhihu.com/?target=https%3A//github.com/thgh/rollup-plugin-serve): 类比 [webpack-dev-server](https://link.zhihu.com/?target=https%3A//github.com/webpack/webpack-dev-server), 提供静态服务器能力

除此之外，我们如果需要使用es6语法，为了兼容性考虑，我们需要使用

+ @babel/core 将代码解析成ast语法，方便各个插件分析语法进行相应的处理，babel 的功能在于「代码转译」，具体一点，即将目标代码转译为能够符合期望语法规范的代码。在转译的过程中，babel 内部经历了「解析 - 转换 - 生成」三个步骤。而 `@babel/core` 这个库则负责「解析」，具体的「转换」和「生成」步骤则交给各种插件（plugin）和预设（preset）来完成。
+ @babel/preset-env preset虽然已经大大方便了我们的使用，但是如果我们还想使用更新一些的语法，比如es2016的**（相当于pow()）,es2017的async/await等等，我们就要引入@babel/preset-es2016，@babel/preset-es2017之类的，而且随着js语法的更新，这些preset会越来越多。于是babel推出了babel-env预设，这是一个智能预设，只要安装这一个preset，就会根据你设置的目标浏览器，自动将代码中的新特性转换成目标浏览器支持的代码。
+ cross-env 设置环境变量
+ cross-var 解决 scripts 中变量使用的兼容性问题 

`yarn add rollup @babel/core @babel/preset-env rollup-plugin-babel rollup-plugin-serve cross-env -D`

## 配置文件rollup.config.js

```js
import buble from 'rollup-plugin-buble';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js', // 入口文件
  output: {
    file: 'dist/vue.js', // 输出文件
    format: 'umd', // 通用模块
    name: 'Vue', // 全局变量名
    sourcemap: true // 源码调试
  },
  plugins: [
    buble(),
    serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: '',
      onListening: server => {
        console.log('Your serer is running at localhost:3000')
      }
    })
  ]
}
```



