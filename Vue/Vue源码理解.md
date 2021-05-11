[toc]

# 从vue-cli脚手架生成的项目开始

<img src="/Users/beijinaqie/Library/Application Support/typora-user-images/image-20210122105626436.png" alt="image-20210122105626436" style="zoom:50%;" />

如上图创建一个最简单最基本的脚手架项目，接着我们来一步一步分析。

## 入口文件main.js

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
```

入口文件就这么简简单单的几行代码，我们来分析下源码里是怎么运行的。

### import Vue from "vue"

```js
import Vue from "vue";
```

从vue依赖中导出Vue，那么源码执行了哪些东西呢？

说到这不得不提一下如何研究大神写的源码，如果没有点技巧，你可能对clone下来的源码一头雾水，入口文件在哪，从哪开始看，如何开始等问题。

```json
{
  "name": "vue",
  "version": "2.6.12",
  "description": "Reactive, component-oriented view layer for modern web interfaces.",
  "main": "dist/vue.runtime.common.js",
  "module": "dist/vue.runtime.esm.js",
  "unpkg": "dist/vue.js",
  "jsdelivr": "dist/vue.js",
  "typings": "types/index.d.ts",
  "files": [
    "src",
    "dist/*.js",
    "types/*.d.ts"
  ],
  "sideEffects": false,
  "scripts": {
    "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev --sourcemap",
    "dev:cjs": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-cjs-dev",
    "dev:esm": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-esm",
    "dev:test": "karma start test/unit/karma.dev.config.js",
    "dev:ssr": "rollup -w -c scripts/config.js --environment TARGET:web-server-renderer",
    "dev:compiler": "rollup -w -c scripts/config.js --environment TARGET:web-compiler ",
    "dev:weex": "rollup -w -c scripts/config.js --environment TARGET:weex-framework",
    "dev:weex:factory": "rollup -w -c scripts/config.js --environment TARGET:weex-factory",
    "dev:weex:compiler": "rollup -w -c scripts/config.js --environment TARGET:weex-compiler ",
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex",
    "test": "npm run lint && flow check && npm run test:types && npm run test:cover && npm run test:e2e -- --env phantomjs && npm run test:ssr && npm run test:weex",
    "test:unit": "karma start test/unit/karma.unit.config.js",
    "test:cover": "karma start test/unit/karma.cover.config.js",
    "test:e2e": "npm run build -- web-full-prod,web-server-basic-renderer && node test/e2e/runner.js",
    "test:weex": "npm run build:weex && jasmine JASMINE_CONFIG_PATH=test/weex/jasmine.js",
    "test:ssr": "npm run build:ssr && jasmine JASMINE_CONFIG_PATH=test/ssr/jasmine.js",
    "test:sauce": "npm run sauce -- 0 && npm run sauce -- 1 && npm run sauce -- 2",
    "test:types": "tsc -p ./types/test/tsconfig.json",
    "lint": "eslint src scripts test",
    "flow": "flow check",
    "sauce": "karma start test/unit/karma.sauce.config.js",
    "bench:ssr": "npm run build:ssr && node benchmarks/ssr/renderToString.js && node benchmarks/ssr/renderToStream.js",
    "release": "bash scripts/release.sh",
    "release:weex": "bash scripts/release-weex.sh",
    "release:note": "node scripts/gen-release-note.js",
    "commit": "git-cz"
  },
  "gitHooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "node scripts/verify-commit-msg.js"
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "git add"
    ]
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuejs/vue.git"
  },
  "keywords": [
    "vue"
  ],
  "author": "Evan You",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/vuejs/vue/issues"
  },
  "homepage": "https://github.com/vuejs/vue#readme",
  "devDependencies": {
    "@babel/core": "^7.0.0",
    "@babel/plugin-proposal-class-properties": "^7.1.0",
    "@babel/plugin-syntax-dynamic-import": "^7.0.0",
    "@babel/plugin-syntax-jsx": "^7.0.0",
    "@babel/plugin-transform-flow-strip-types": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "@babel/register": "^7.0.0",
    "@types/node": "^12.12.0",
    "@types/webpack": "^4.4.22",
    "acorn": "^5.2.1",
    "babel-eslint": "^10.0.1",
    "babel-helper-vue-jsx-merge-props": "^2.0.3",
    "babel-loader": "^8.0.4",
    "babel-plugin-istanbul": "^5.1.0",
    "babel-plugin-transform-vue-jsx": "^4.0.1",
    "babel-preset-flow-vue": "^1.0.0",
    "buble": "^0.19.3",
    "chalk": "^2.3.0",
    "chromedriver": "^2.45.0",
    "codecov": "^3.0.0",
    "commitizen": "^2.9.6",
    "conventional-changelog": "^1.1.3",
    "cross-spawn": "^6.0.5",
    "cz-conventional-changelog": "^2.0.0",
    "de-indent": "^1.0.2",
    "es6-promise": "^4.1.0",
    "escodegen": "^1.8.1",
    "eslint": "^5.7.0",
    "eslint-plugin-flowtype": "^2.34.0",
    "eslint-plugin-jasmine": "^2.8.4",
    "file-loader": "^3.0.1",
    "flow-bin": "^0.61.0",
    "hash-sum": "^1.0.2",
    "he": "^1.1.1",
    "http-server": "^0.12.3",
    "jasmine": "^2.99.0",
    "jasmine-core": "^2.99.0",
    "karma": "^3.1.1",
    "karma-chrome-launcher": "^2.1.1",
    "karma-coverage": "^1.1.1",
    "karma-firefox-launcher": "^1.0.1",
    "karma-jasmine": "^1.1.0",
    "karma-mocha-reporter": "^2.2.3",
    "karma-phantomjs-launcher": "^1.0.4",
    "karma-safari-launcher": "^1.0.0",
    "karma-sauce-launcher": "^2.0.2",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-webpack": "^4.0.0-rc.2",
    "lint-staged": "^8.0.0",
    "lodash": "^4.17.4",
    "lodash.template": "^4.4.0",
    "lodash.uniq": "^4.5.0",
    "lru-cache": "^5.1.1",
    "nightwatch": "^0.9.16",
    "nightwatch-helpers": "^1.2.0",
    "phantomjs-prebuilt": "^2.1.14",
    "puppeteer": "^1.11.0",
    "resolve": "^1.3.3",
    "rollup": "^1.0.0",
    "rollup-plugin-alias": "^1.3.1",
    "rollup-plugin-buble": "^0.19.6",
    "rollup-plugin-commonjs": "^9.2.0",
    "rollup-plugin-flow-no-whitespace": "^1.0.0",
    "rollup-plugin-node-resolve": "^4.0.0",
    "rollup-plugin-replace": "^2.0.0",
    "selenium-server": "^2.53.1",
    "serialize-javascript": "^3.1.0",
    "shelljs": "^0.8.1",
    "terser": "^3.10.2",
    "typescript": "^3.6.4",
    "webpack": "~4.28.4",
    "weex-js-runtime": "^0.23.6",
    "weex-styler": "^0.3.0",
    "yorkie": "^2.0.0"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}

```



我们先找到`package.json`这个文件，里面记录着这个项目的一些信息，比如项目所需的依赖，项目的脚本，项目的作者等等，其中一个关键词就是`main`，`main`字段指定了模块的入口程序文件，但是有些项目不存在或者不是正确的入口文件。所以这个只做第一步参考。

接着我们需要找到`scripts`字段，这个字段里面定义者一些脚本命令，我们可以找到，诸如开发环境的构建命令，生产环境的构建命令，又或者是其它环境的命令。我们在vue的`package.json`里面是能找到`main`关键字的，我们根据路径去找`dist/vue.runtime.common.js`，发现这是个打包之后的产物，很明显这不是我们所需要的，因此，我们去找`scripts`，里面的脚本命令还是蛮多的，但是我们只需要找两个命令就行，一个是`dev`，一个是`build`，很明显，这两个一个是开发环境，一个则是生产环境，继续看下去，`"dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev --sourcemap"`，这里面有一个rollup打包的命令，-w 监听文件变动，就重新打包，-c 以rollup配置文件进行打包，`scripts/config.js`就是指定配置文件路径，不跟上路径则默认文件名是根路径下`rollup.config.js`，并且指定了当前运行环境是`web-full-dev`，并且为了方面调试，开启了sourcemap。rollup也是一款js模块打包器，与webpack不同的是，rollup专注于js的打包，而webapck差不多是万物皆模块，模块皆可打包，除了js，json等，你可以通过安装对应的loader，来解析不同的文件，如图片，css，vue，react等

我们接下来就去`scripts/config.js`文件，最显眼的就是builds对象，这个对象保存着不同环境的对应打包方式。接着直接到文件最下面

```js
if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
```

通过命令行我们是第一种逻辑，执行`genConfig`方法

```js
function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      flow(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Vue'
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  // built-in vars
  const vars = {
    __WEEX__: !!opts.weex,
    __WEEX_VERSION__: weexVersion,
    __VERSION__: version
  }
  // feature flags
  Object.keys(featureFlags).forEach(key => {
    vars[`process.env.${key}`] = featureFlags[key]
  })
  // build-specific env
  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(vars))

  if (opts.transpile !== false) {
    config.plugins.push(buble())
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}
```

最后会返回一个rollup配置文件，rollup就按照该配置文件进行打包。

通过dev的参数，我们发现实际的配置文件是这个

```js
'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
```

很明显，`resolve`函数使用的路径经过了`alias`的别名处理，我们看看`resolve`函数的定义

```js
const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```

不难发现，上面的一行代码，也就是同级的`alias.js`里面存在着别名处理，打开`alias.js`

```js
const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc')
}
```

由此我们可以找到`web/entry-runtime-with-compiler.js`这个文件的实际文件地址`src/platforms/web/webentry-runtime-with-compiler.js`。当当当，入口文件终于被找到了。而且这个文件也确实存在着Vue对象。

到这里不得不提一下Vue的两种模版编译方式，运行时+模版编译 vs 运行时，这两种区别就在于对于`template`的解析，即

```js
new Vue({
  template: '<p>Vue</p>'
})
```

而借助于`vue-loader`工具，写在组件模版里面的代码会在构建时被预编译成`javascript`，而只包含运行时的版本会比运行时+模版编译轻量30%，所以尽可能地使用只包含运行时的版本，更多[点击这里](https://cn.vuejs.org/v2/guide/installation.html#Vue-Devtools)。

在`src/platforms/web/webentry-runtime-with-compiler.js`文件，找到`import Vue from './runtime/index'`，又在`src/platforms/web/runtime/index.js`里面找到`import Vue from 'core/index'`，最后我们在`src/code/index.js`里面找到这个`import Vue from './instance/index'`，在这个文件夹下，我们看到了`components`、`global-api`、`instance`、`observer`、`vdom`，显然这里面是vue的核心逻辑，继续往下找`import Vue from './instance/index'`，这里终于找到了Vue构造函数，真不容易，隐藏太深了。

```bash
├─dist                   # 项目构建后的文件
├─scripts                # 与项目构建相关的脚本和配置文件
├─flow                   # flow的类型声明文件
├─src                    # 项目源代码
│    ├─complier          # 与模板编译相关的代码
│    ├─core              # 通用的、与运行平台无关的运行时代码
│    │  ├─observe        # 实现变化侦测的代码
│    │  ├─vdom           # 实现virtual dom的代码
│    │  ├─instance       # Vue.js实例的构造函数和原型方法
│    │  ├─global-api     # 全局api的代码
│    │  └─components     # 内置组件的代码
│    ├─server            # 与服务端渲染相关的代码
│    ├─platforms         # 特定运行平台的代码，如weex
│    ├─sfc               # 单文件组件的解析代码
│    └─shared            # 项目公用的工具代码
└─test                   # 项目测试代码
```

这张图就介绍了源码目录的大致作用。好了我们接着往下说。

在`src/core/instance/index.js`这个文件里，我们找到了Vue的构造函数，紧接着我们开始往下执行。

```js
// debugger
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue

```

首先引入一堆函数，这里说一点，import 引入的是只读引用类型，不允许修改暴露出来的值，存在内存中，只在调用才会运行。而require则是一个浅拷贝，只第一次加载，后续只会读取缓存中的值，除非手动清除缓存。

接着定义一个构造函数，里面有一个_init()方法，继续执行。

`initMixin(Vue)`，这个时候我们去`./init`里面看，里面东西很多，我们只看重点，找到`initMixin()函数`，开始执行，函数接收一个Vue作为参数，接着在构造函数上挂载一个原型方法就是`_init`，这个方法还接受一个对象作为参数。由于方法未执行，我们就先看到这里。

```js
// 以下为伪代码
class Vue {
  constructor(optins) {
    
  }
  _init() {}
}
```



执行`stateMixin(Vue)`，我们找到`./state`文件，找到`stateMixin`方法，发现往原型上挂载了两个属性`$data`、`$props`，以及三个方法`$set`、`$delete`、`$watch`，vue源码有这样一个设计原则，`$`命名的变量都是暴露给用户进行只读的，而`_`命名的变量则是vue内部自己使用可读可写的。到这一步Vue构造函数的上已经有了这些

```js
// 以下为伪代码
class Vue {
  constructor(optins) {
  + this.$data
  + this.$props
  }
+ $set() {}
+ $delete() {}
+ $watch() {}
  _init() {}
}
```

执行`eventsMixin(Vue)`，我们找到`./event`文件，找到`eventsMixin`方法，开始执行，这个方法依然是往Vue的原型对象上挂载方法，挂载了`$on`、`$once`、`$off`、`$emit`等。

```js
// 以下为伪代码
class Vue {
  constructor(optins) {
    this.$data
    this.$props
  }
  $set() {}
  $delete() {}
  $watch() {}
+ $on() {}
+ $once() {}
+ $off() {}
+ $emit() {}
  _init() {}
}
```

执行`lifecycleMixin(Vue)`，我们找到`./lifecycle`文件，找到`lifecycleMixin`方法，开始执行，发现这个方法依然是往Vue原型对象上挂载方法，`_update`、`$forceUpdate`、`$destroy`

```js
// 以下为伪代码
class Vue {
  constructor(optins) {
    this.$data
    this.$props
  }
  $set() {}
  $delete() {}
  $watch() {}
	$on() {}
	$once() {}
	$off() {}
	$emit() {}
+ $forceUpdate() {}
+ $destroy() {}
  _init() {}
+ _update() {}
}
```

执行`renderMixin(Vue)`，我们找到`./render`，找到`renderMixin`方法，开始执行，同样，还是在往Vue原型对象上挂载方法`$nextTick`、`_render`，有一点不同的是这个函数里面执行了一个`installRenderHelpers`方法，并且将Vue的原型对象传了过去，我们顺着网线，哦不，顺着路径继续往下找，`./render-helpers/index`，找到`installRenderHelpers`方法，哦豁，好家伙，挂载了那么多东西，我们也不知道这是啥玩意，反正`_`开头的都是vue自己用的，我们记录下来就行。

```js
// 以下为伪代码
class Vue {
  constructor(optins) {
    this.$data
    this.$props
  }
  $set() {}
  $delete() {}
  $watch() {}
	$on() {}
	$once() {}
	$off() {}
	$emit() {}
  $forceUpdate() {}
  $destroy() {}
+ $nextTick() {}
  _init() {}
  _update() {}
+ _render() {}
+ _o() {}
+ _n() {}
+ _s() {}
+ _l() {}
+ _t() {}
+ _q() {}
+ _i() {}
+ _m() {}
+ _f() {}
+ _k() {}
+ _b() {}
+ _v() {}
+ _e() {}
+ _u() {}
+ _g() {}
+ _d() {}
+ _p() {}
}
```

让我们的视线回到`src/core/index`，上面的那一句`import Vue from './instance/index'`已经执行完毕了，然后接着执行。记着，import导入的只是一个引用，不去调用就不去管它。

开始执行`initGlobalAPI(Vue)`，找到`./global-api/index`文件，找到`initGlobalAPI`开始执行方法，往构造函数自身挂载属性`config`、`util`、`delete`、`nextTick`、`observable`、`options`， 接着往`Vue.options`里面挂载属性，`components`、`directives`、`filters`、`_base`，执行`extend`函数，把vue内置组件`KeepAlive`混入到`Vue.options.components`里面，继续往执行`initUse(Vue)`，往Vue构造函数身上挂载了`use`方法，执行`initMixin(Vue)`挂载了`mixin`，执行`initExtend(Vue)`往上挂载了`extend`方法同时也挂载了一个属性`cid`，执行`initAssetRegisters(Vue)`，往身上挂载了`components`、`directives`、`filters`方法。

上面有点乱，我们来整理下，`initGlobalAPI(Vue)`这个方法，实际上就是往Vue身上挂载全局属性以及方法的。到了这一步，我们看看那，Vue身上的属性和方法哈。

```js
// 以下为伪代码 #表示属于构造函数的私有属性或方法
class Vue {
+ #cid
+ #config = {
  	optionMergeStrategies: Object.create(null),
    silent: false,
    productionTip: process.env.NODE_ENV !== 'production',
    devtools: process.env.NODE_ENV !== 'production',
    performance: false,
		errorHandler: null,
    warnHandler: null,
    ignoredElements: [],
    keyCodes: Object.create(null),
    isReservedTag: no,
    isReservedAttr: no,
    isUnknownElement: no,
    getTagNamespace: noop,
    parsePlatformTagName: identity, // identity => _
    mustUseProp: no,
    async: true,
    _lifecycleHooks: {
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'activated',	
      'deactivated',
      'errorCaptured',
      'serverPrefetch'
    }
	}
+ #util = {
  	warn() {},
    extend() {},
    mergeOptions() {},
    defineReactive() {}
	}
+ #options = {
  	components: {
      KeepAlive
    },
    directives: Object.create(null),
    filters: Object.create(null),
  	_base: Vue
	}
  constructor(optins) {
    this.$data
    this.$props
  }
  $set() {}
  $delete() {}
  $watch() {}
	$on() {}
	$once() {}
	$off() {}
	$emit() {}
  $forceUpdate() {}
  $destroy() {}
	$nextTick
  _init() {}
  _update() {}
	_render() {}
  _o() {}
	_n() {}
	_s() {}
	_l() {}
	_t() {}
	_q() {}
	_i() {}
	_m() {}
	_f() {}
	_k() {}
	_b() {}
	_v() {}
	_e() {}
	_u() {}
	_g() {}
	_d() {}
	_p() {}
+ #set() {}
+ #delete() {}
+ #nextTick() {}
+ #observable() {}
+ #use() {}
+ #mixin() {}
+ #extend() {}
+ #component() {}
+ #directive() {}
+ #filter() {}
}
```

到目前来说，只执行了这两句，Vue构造函数就已经有了一大堆属性和方法了。

```js
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
```

我们回到`src/core/index`，接着`initGlobalAPI(Vue)`继续往下执行，给Vue原型对象上挂载属性`$isServer`、`$ssrContext`以及给Vue构造函数挂载`FunctionalRenderContext`和`version`。回退到`src/platforms/web/entry-runtime-with-compiler`，顺着`import Vue from './runtime/index'`往下执行，这里给Vue原型对象上添加了一个`$mount`方法，以及给Vue构造函数添加了一个`compile`方法。至此Vue入口文件执行完毕，我们来看下，现在的Vue构造函数长什么样子。

```js
// 以下为伪代码 #表示属于构造函数的私有属性或方法
class Vue {
 	#cid
  #config = {
  	optionMergeStrategies: Object.create(null),
    silent: false,
    productionTip: process.env.NODE_ENV !== 'production',
    devtools: process.env.NODE_ENV !== 'production',
    performance: false,
		errorHandler: null,
    warnHandler: null,
    ignoredElements: [],
    keyCodes: Object.create(null),
    isReservedTag: no,
    isReservedAttr: no,
    isUnknownElement: no,
    getTagNamespace: noop,
    parsePlatformTagName: identity, // identity => _
    mustUseProp: no,
    async: true,
    _lifecycleHooks: {
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'activated',	
      'deactivated',
      'errorCaptured',
      'serverPrefetch'
    }
	}
  #util = {
  	warn() {},
    extend() {},
    mergeOptions() {},
    defineReactive() {}
	}
  #options = {
  	components: {
      KeepAlive
    },
    directives: Object.create(null),
    filters: Object.create(null),
  	_base: Vue
	}
+ #FunctionalRenderContext
+ #version
  constructor(optins) {
    this.$data
    this.$props
  + this.$isServer
  + this.$ssrContext
  }
  $set() {}
  $delete() {}
  $watch() {}
	$on() {}
	$once() {}
	$off() {}
	$emit() {}
  $forceUpdate() {}
  $destroy() {}
+	$mount
  _init() {}
  _update() {}
  _o() {}
	_n() {}
	_s() {}
	_l() {}
	_t() {}
	_q() {}
	_i() {}
	_m() {}
	_f() {}
	_k() {}
	_b() {}
	_v() {}
	_e() {}
	_u() {}
	_g() {}
	_d() {}
	_p() {}
	#set() {}
  #delete() {}
  #nextTick() {}
  #observable() {}
  #use() {}
  #mixin() {}
  #extend() {}
  #component() {}
  #directive() {}
  #filter() {}
+ #compile() {}
}
```

接下来我们来验证下我们的猜想对不对，我们打开脚手架生成的入口文件`main.js`，打印一下`Vue`。

```js
import Vue from "vue";
console.dir(Vue);
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

```

输出到浏览器的`Vue`对象如下图所示，基本上符合我们的预期设想。

<img src="/Users/beijinaqie/Library/Application Support/typora-user-images/image-20210126150327923.png" alt="image-20210126150327923" style="zoom:50%;" />

### import App from "./App.vue"

导入一个模版App

### import router from "./router"

导入一个`router`实例，我们来到`./router`文件，开始执行。

```js
import Vue from "vue";
import VueRouter from "vue-router";
```

分别导入，Vue构造函数以及VueRouter构造函数。

开始执行

```js
Vue.use(VueRouter);
```

前面我们已经分析过了，Vue构造函数身上是有`use`方法的，我们去找下它，在`src/core/global-api/use`。

```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

函数接受一个函数或者对象作为参数，其内部维护一个`installedPlugins`数组，同时在Vue上挂载了一个属性`_installedPlugins`，如果plugin已经注册过，就返回。否则声明一个数组，传入的参数列表类似这种`[arg1, arg2, ...]`，最后把Vue插入到索引为0的位置，即最后的数组为`[Vue, arg1, arg2, ...]`，紧接着进行判断，如何插件是一个对象且内部存在`install`方法，那么就执行该方法，如果插件是一个方法，那么就会直接执行该插件。最后将插件push到缓存到已注册插件的数组`installedPlugins`里。最后返回`Vue`对象。

不难理解，通过安装`vue-router`，拥有了路由功能，同理，`vuex`也是一样，这里不再详细多说，有兴趣的可以了解下源码。

### Vue.config.productionTip = false

还记得之前的`Vue`构造函数嘛，其自身拥有的`config`属性下的一个属性，大概意思就是，开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。而在生产环境下，这些警告语句却没有用，反而会增加应用的体积。此外，有些警告检查还有一些小的运行时开销，这在生产环境模式下是可以避免的。

### new Vue({ ... }).$mount("#app")

接下来开始通过`new`关键字来实例化Vue，这也是重中之重。

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

执行Vue构造函数，调用`_init(options)`，同时把用户传入的选项当作参数传递进去。执行`src/core/instance/init.js`

```js
/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    console.log('--beforeCreate--')
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    console.log('--created--')
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}

```

执行`_init()`方法。

```js
if (options && options._isComponent) {
  // optimize internal component instantiation
  // since dynamic options merging is pretty slow, and none of the
  // internal component options needs special treatment.
  initInternalComponent(vm, options)
} else {
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
}
```

这块的逻辑是如果存在`options`而且是子组件那么久执行`initInternalComponent(vm, options)`，如果是第一次通过`new Vue`创建则执行

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

这块的逻辑就是合并`Vue`默认的`options`和用户自定义的`options`。

紧接着依次执行

```js
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

`initLifecycle(vm)`

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

首先是给实例上挂载`$parent`属性，这个属性有点意思，我们先来看看代码。

```js
let parent = options.parent
if (parent && !options.abstract) {
  while (parent.$options.abstract && parent.$parent) {
    parent = parent.$parent
  }
  parent.$children.push(vm)
}
```

从代码中可以看到，逻辑是这样子的：如果当前组件不是抽象组件并且存在父级，那么就通过`while`循环来向上循环，如果当前组件的父级是抽象组件并且也存在父级，那就继续向上查找当前组件父级的父级，直到找到第一个不是抽象类型的父级时，将其赋值`vm.$parent`，同时把该实例自身添加进找到的父级的`$children`属性中。这样就确保了在子组件的`$parent`属性上能访问到父组件实例，在父组件的`$children`属性上也能访问子组件的实例。

然后就是挂载一些属性

```js
vm.$children = []
vm.$refs = {}

vm._watcher = null
vm._inactive = null
vm._directInactive = false
vm._isMounted = false
vm._isDestroyed = false
vm._isBeingDestroyed = false
```

`initEvents(vm)`

```js
/* @flow */

import {
  tip,
  toArray,
  hyphenate,
  formatComponentName,
  invokeWithErrorHandling
} from '../util/index'
import { updateListeners } from '../vdom/helpers/index'

export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

let target: any

function add (event, fn) {
  target.$on(event, fn)
}

function remove (event, fn) {
  target.$off(event, fn)
}

function createOnceHandler (event, fn) {
  const _target = target
  return function onceHandler () {
    const res = fn.apply(null, arguments)
    if (res !== null) {
      _target.$off(event, onceHandler)
    }
  }
}

export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm)
  target = undefined
}

export function eventsMixin (Vue: Class<Component>) {
  const hookRE = /^hook:/
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }

  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    // specific handler
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      const info = `event handler for "${event}"`
      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }
    return vm
  }
}
```

可以看到，`initEvents`函数逻辑非常简单，首先在`vm`上新增`_events`属性并将其赋值为空对象，用来存储事件。

```js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

接着，获取父组件注册的事件赋给`listeners`，如果`listeners`不为空，则调用`updateComponentListeners`函数，将父组件向子组件注册的事件注册到子组件的实例中。

父组件既可以给子组件上绑定自定义事件，也可以绑定浏览器原生事件。这两种事件有着不同的处理时机，浏览器原生事件是由父组件处理，而自定义事件是在子组件初始化的时候由父组件传给子组件，再由子组件注册到实例的事件系统中。也就是说：**初始化事件函数initEvents实际上初始化的是父组件在模板中使用v-on或@注册的监听子组件内触发的事件**。

`initRender(vm)`

```js
/* @flow */

import {
  warn,
  nextTick,
  emptyObject,
  handleError,
  defineReactive
} from '../util/index'

import { createElement } from '../vdom/create-element'
import { installRenderHelpers } from './render-helpers/index'
import { resolveSlots } from './render-helpers/resolve-slots'
import { normalizeScopedSlots } from '../vdom/helpers/normalize-scoped-slots'
import VNode, { createEmptyVNode } from '../vdom/vnode'

import { isUpdatingChildComponent } from './lifecycle'

export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data
  console.log('--render--');
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}

export let currentRenderingInstance: Component | null = null

// for testing only
export function setCurrentRenderingInstance (vm: Component) {
  currentRenderingInstance = vm
}

export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }

  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
}
```

这个方法最主要的就是这两句

```js
// bind the createElement fn to this instance
// so that we get proper render context inside it.
// args order: tag, data, children, normalizationType, alwaysNormalize
// internal version is used by render functions compiled from templates
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
// normalization is always applied for the public version, used in
// user-written render functions.
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```

给实例身上挂载`_c`、`$createElement`两个方法，那么这两个方法干什么用的呢？这两个方法都是返回`vnode`的，区别在于`_c`是模板编译成的 `render` 函数使用而`$createElement`则是用户手写`render`调用。这两个方法支持的参数相同，并且内部都调用了 `createElement` 方法。

然后对`$attrs`、`$listeners`进行劫持响应。

```js
if (process.env.NODE_ENV !== 'production') {
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
    !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
  }, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
    !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
  }, true)
} else {
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}
```

初始化渲染方法。

`callHook(vm, 'beforeCreate')`

这个时候开始第一个生命周期钩子函数。

`initInjections(vm)`

初始化`inject`，既然`inject`选项和`provide`选项都是成对出现的，那为什么在初始化的时候不一起初始化呢？为什么在`init`函数中调用`initInjections`函数和`initProvide`函数之间穿插一个`initState`函数呢？其实不然，在官方文档示例中说了，`provide`选项注入的值作为数据入口。这里所说的数据就是我们通常所写`data`、`props`、`watch`、`computed`及`method`，所以`inject`选项接收到注入的值有可能被以上这些数据所使用到，所以在初始化完`inject`后需要先初始化这些数据，然后才能再初始化`provide`，所以在调用`initInjections`函数对`inject`初始化完之后需要先调用`initState`函数对数据进行初始化，最后再调用`initProvide`函数对`provide`进行初始化。

`initState(vm)`

