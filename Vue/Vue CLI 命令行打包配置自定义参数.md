# 构建变量

+ 只有以 VUE_APP_ 开头的变量会被静态嵌入到客户端侧的包中。你可以在应用的代码中这样访问它们

```js
console.log(process.env.VUE_APP_PAGE_ID)
```

+ 除了 VUE_APP_* 变量之外，在你的应用代码中始终可用的还有两个特殊的变量
  + NODE_ENV - 会是 “development”、“production” 或 “test” 中的一个。具体的值取决于应用运行的模式。
  + BASE_URL - 会和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。

# 解析参数

+ npm指令需要读取 process.env.npm_config_argv
+ vue-cli-service指令需要读取 process.argv

```js
// 解析指令参数
// npm指令需要读取 process.env.npm_config_argv
const argv = JSON.parse(process.env.npm_config_argv);
// vue-cli-service指令需要读取 process.argv
const argv1 = process.argv;

console.log("process.env.npm_config_argv值", argv)
console.log("process.argv值", argv1)

```

# 实际应用

执行npm命令

`yarn run build:devops --buildVersion=v1 --buildName=front --apiVersion=v2 --gatewayCtx=gateway`

Build.js文件执行以下脚本

```js
'use strict';

const shell = require('shelljs');
const devopsArgv = JSON.parse(process.env.npm_config_argv).original;
let buildVersion = '';
let buildName = '';
let apiVersion = '';
let gatewayCtx = '';

devopsArgv.forEach(argv => {
  if (argv.indexOf('--buildVersion=') !== -1) {
    buildVersion = argv.substr(argv.indexOf('=') + 1);
  }
  if (argv.indexOf('--buildName=') !== -1) {
    buildName = argv.substr(argv.indexOf('=') + 1);
  }
  if (argv.indexOf('--apiVersion=') !== -1) {
    apiVersion = argv.substr(argv.indexOf('=') + 1);
  }
  if (argv.indexOf('--gatewayCtx=') !== -1) {
    gatewayCtx = argv.substr(argv.indexOf('=') + 1);
  }
});

if (!buildVersion) {
  shell.echo('Sorry, this script requires buildVersion');
  shell.exit(1);
}

if (!buildName) {
  shell.echo('Sorry, this script requires buildName');
  shell.exit(1);
}

if (!apiVersion) {
  shell.echo('Sorry, this script requires apiVersion');
  shell.exit(1);
}

if (!gatewayCtx) {
  shell.echo('Sorry, this script requires gatewayCtx');
  shell.exit(1);
}

const baseUrl = `/${buildVersion}/${buildName}/`;
const apiUrl = `/${apiVersion}/${gatewayCtx}`;
const command = `cross-env VUE_APP_BASE_URL=${baseUrl} VUE_APP_API_URL=${apiUrl} VUE_APP_BUILD_MODE=devops vue-cli-service build`;

if (shell.exec(command).code !== 0) {
  shell.echo('Error: Devops build failed');
  shell.exit(1);
}

```

