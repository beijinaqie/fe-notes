<!-- TOC -->

- [1. vite插件是什么](#1-vite插件是什么)
- [2. vite插件的形式](#2-vite插件的形式)
- [3. 插件钩子](#3-插件钩子)
- [4. 钩子顺序](#4-钩子顺序)
- [5. 插件顺序](#5-插件顺序)
- [6. demo](#6-demo)

<!-- /TOC -->
# 1. vite插件是什么

浏览器只能识别js中的es模块，为了让浏览器识别更多资源，需要vite开发服务器给浏览器提供解决方案，而对于生产环境来讲，受限于网络等因素影响，会使用rollup对资源进行打包处理。
![图片1](https://pic2.zhimg.com/80/v2-59367bb86cfbed114be6107a2d314421_1440w.jpg)

# 2. vite插件的形式

vite插件扩展自rollup插件接口，只是额外多了一些vite选项  
vite插件是一个拥有名称，创建钩子和生成钩子的对象
![图片2](https://pic4.zhimg.com/80/v2-e0166e8f070c12b918f6a1bd77718c9b_1440w.jpg)

如果需要配置选项，则可以使用函数返回对象的形式来创建
![图片3](https://pic2.zhimg.com/80/v2-4d285f6e443b58af80f8c9ba5a06dc09_1440w.jpg)

# 3. 插件钩子
  ## 通用钩子
    开发时，Vite dev server创建一个插件容器按照Rollup调用创建钩子的规则请求各个钩子函数。

  + 下面钩子会在服务器启动时调用一次:
    + options 替换或操纵rollup选项
    + buildStart 开始创建
  + 下面钩子每次有模块请求时都会被调用:
    + resolveId 创建自定义确认函数，常用语定位第三方依赖
    + load 创建自定义加载函数，可用于返回自定义的内容
    + transform 可用于转换已加载的模块内容
  + 下面钩子会在服务器关闭时调用一次:
    + buildEnd
    + closeBundle
  ## Vite特有钩子
    + config: 修改Vite配置
    + configResolved：Vite配置确认
    + configureServer：用于配置dev server
    + transformIndexHtml：用于转换宿主页
    + handleHotUpdate：自定义HMR更新时调用

# 4. 钩子顺序
```js
export default function myExample (options) {
  // 返回的是插件对象
  return {
    name: 'hooks-order', 
    // 初始化hooks，只走一次
    options(opts) {
      console.log('options', opts);
    },
    buildStart() {
      console.log('buildStart');
    },
    // vite特有钩子
    config(config) {
      console.log('config', config);
      return {}
    },
    configResolved(resolvedCofnig) {
      console.log('configResolved');
    },
    configureServer(server) {
      console.log('configureServer');
      // server.app.use((req, res, next) => {
      //   // custom handle request...
      // })
    },
    transformIndexHtml(html) {
      console.log('transformIndexHtml');
      return html
      // return html.replace(
      //   /<title>(.*?)<\/title>/,
      //   `<title>Title replaced!</title>`
      // )
    },
    // 通用钩子
    resolveId ( id ) {
      if (id === 'virtual-module') {
        console.log('resolvedId', id);
        return id; 
      }
      return null; 
    },
    load ( id ) {
      if (id === 'virtual-module') {
        console.log('load');
        return 'export default "This is virtual!"';
      }
      return null;
    },
    transform(code, id) {
      if (id === 'virtual-module') {
        console.log('transform');
      }
      return code
    },
  };
}
```
![图片4](https://pic1.zhimg.com/80/v2-56fee67dffce7a518213ce6239d4be20_1440w.jpg)

# 5. 插件顺序
  + 别名处理`Alias`
  + 用户插件设置`enforce: 'pre'`
  + Vite核心插件
  + 用户插件未设置`enforce`
  + Vite构建插件
  + 用户插件设置`enforce: 'post'`
  + Vite构建后置插件(minify, manifest, reporting)
# 6. demo