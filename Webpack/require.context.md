### require.context

可以使用 require.context() 方法来创建自己的（模块）上下文，这个方法有 3 个参数

+ 要搜索的文件夹目录
+ 是否还应该搜索它的子目录
+ 以及一个匹配文件的正则表达式

> **require.context模块导出（返回）一个（require）函数**，这个函数可以接收一个参数：request 函数–这里的 request 应该是指在 require() 语句中的表达式

导出的方法有 3 个属性： resolve, keys, id。

+ resolve 是一个函数，它返回请求被解析后得到的模块 id
+ keys 也是一个函数，它返回一个数组，由所有可能被上下文模块处理的请求组成
+ id 是上下文模块里面所包含的模块 id. 它可能在你使用 module.hot.accept 的时候被用到

**ps: **

![图片](https://user-gold-cdn.xitu.io/2018/3/26/16261acab3f0650c?imageslim)

```js
/**
* The file enables `@/store/index.js` to import all vuex modules
* in a one-shot manner. There should not be any reason to edit this file.
*/

const files = require.context('./modules', false, /\.js$/)
console.log('------------')
console.log(files.keys())
console.log('------------')
const modules = {}

files.keys().forEach(key => { 
   modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

console.log('------------')
console.log(modules)
console.log('------------')
export default modules


```

![图片](https://user-gold-cdn.xitu.io/2018/3/26/16261aacaba6b745?imageslim)

## 全局注册组件

```js
import caller from './message/index';
// 自动化注册全局组件
export default {
  install(Vue, opts) {
    Vue.prototype.$message = caller;

    const files = require.context('./', true, /\.vue$/);

    files
      .keys()
      .map(key => files(key))
      .map(({ default: component }) => {
        Vue.component(component.name, component);
      });
  }
};

```

