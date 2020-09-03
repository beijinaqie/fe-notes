# vue 页面刷新报错出现空白

![图片实例](https://forum.vuejs.org/uploads/default/original/3X/4/9/49840958e284bb79a23718e85e6b515035aa1440.png)

如果是本地出错那么则是publicPath的配置出错，导致`index.html`文件加载静态资源出错。如果是采用的history模式，在线上打包出错，第一次点击正常，是因为`vue-router`拦截了导航浏览器的导航行为，这个时候报错则是浏览器向后端发起的请求，后端匹配不到导致。

```js
// ngnix 配置如下
location / {
  try_files $uri $uri/ {这里要保证和你的publicPath一致}/index.html;
}
```

# 关于vue-cli3打包时遇到Cannot assign to read only property ‘exports’ of object '#'问题的解决方法。

+ 第一种原因就是import和module.exports的混用要知道commonJS和ES6的语法是不太一样的前者是require和module.exports后者则是import和exports,当你混用这两个语法的时候，webpack就会报错，也就是第一种情况。为了使编译好的程序能在大多数浏览器下运行。
  webpack里面有一个编译器叫Babel，负责把ES6的语言转化为commonJS以兼容绝大多数浏览器。当你混用这两个语法的时候你可以使用babel的commonJS模式帮你把import编译成require。
+ 第二种情况就是你要使用@babel/plugin-transform-runtime这个插件的时候，同时你又在某个commonJS写的文件里使用这个插件时，babel会默认你这个文件是ES6的文件，然后就使用import导入了这个插件，从而产生了和第一种情况一样的混用错误。解决方法是在babel.config.js里配置unambiguous设置，让babel和webpack一样严格区分commonJS文件和ES6文件。

```js
module.exports = {
  presets: [
    '@vue/app'
  ],
  sourceType: 'unambiguous'
}
```

