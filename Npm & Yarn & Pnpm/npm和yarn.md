[toc]

# npm 和 yarn比较

## npm 和 yarn 的不同

| npm                       |           yarn            |                           描述 |
| ------------------------- | :-----------------------: | -----------------------------: |
| npm install(npm i)        |    yarn install(yarn)     | 根据 package.json 安装所有依赖 |
| npm i –save [package]     |    yarn add [package]     |                     添加依赖包 |
| npm i –save-dev [package] |  yarn add [package] –dev  |   添加依赖包至 devDependencies |
| npm i -g [package]        | yarn global add [package] |             进行全局安装依赖包 |
| npm update –save          |  yarn upgrade [package]   |                     升级依赖包 |
| npm uninstall [package]   |   yarn remove [package]   |                     移除依赖包 |

## npm 和 yarn 的相同

| npm                              |               yarn                |                                   描述 |
| -------------------------------- | :-------------------------------: | -------------------------------------: |
| npm run                          |             yarn run              |       运行 package.json 中预定义的脚本 |
| npm config list                  |         yarn config list          |                           查看配置信息 |
| npm config set registry 仓库地址 | yarn config set registry 仓库地址 |                           更换仓库地址 |
| npm init                         |             yarn init             |      互动式创建/更新 package.json 文件 |
| npm list                         |             yarn list             |           查看当前目录下已安装的node包 |
| npm login                        |            yarn login             |                   保存你的用户名、邮箱 |
| npm logout                       |            yarn logout            |                   删除你的用户名、邮箱 |
| npm outdated                     |           yarn outdated           |                       检查过时的依赖包 |
| npm link                         |             yarn link             | 开发时链接依赖包，以便在其他项目中使用 |
| npm unlink                       |            yarn unlink            |                         取消链接依赖包 |
| npm publish                      |           yarn publish            |                         将包发布到 npm |
| npm test                         |             yarn test             |                   测试 = yarn run test |
| npm bin                          |             yarn bin              |            显示 bin 文件所在的安装目录 |
| yarn info                        |             yarn info             |                       显示一个包的信息 |



## npm 所独有

- `npm rebuild pacakgename`: 用于更改包内容后进行重建；比如常见的`npm rebuild node-sass`；当使用Sass（Scss）来作样式表预处理器，再打包的时候，你可能会遇见如下错误；而解决此问题，最为简单的方式即使用 rebuild 命令，对 node-sass 进行重建即可

```shell
Module build failed: ModuleBuildError: Module build failed: Error: Node Sass does not yet support your current environment: 
This usually happens because your environment has changed since running npm install. Run npm rebuild node-sass to build the binding for your current environment.
```



## yarn 所独有

- `yarn import`：依据原npm安装后的node_modules目录生成一份yarn.lock文件；
- `yarn licenses`：列出已安装包的许可证信息
- `yarn pack`：创建一个压缩的包依赖 gzip 档案
- `yarn why`：显示有关一个包为何被安装的信息
- `yarn autoclean`：从包依赖里清除并移除不需要的文件

## npm安装依赖临时切换源

```js
npm install xxx --registry https://registry.npm.taobao.org // 第一种

npm set registry https://registry.npm.taobao.org 第二种
npm install xxx
```

## npm 永久安装

```js
npm config set registry https://registry.npm.taobao.org // 第一种
// .npmrc文件中加入
registry = https://registry.npm.taobao.org
```

## .npmrc文件

```js
// 没有指定的全部走默认
registry=https://registry.npm.taobao.org
// 指定的依赖走这里
@vue:registry=https://registry.npm.taobao.org
package-lock=false;     //在安装时忽略lock文件。
loglevel=timing；      // 安装依赖包的时候指定日志的类型
```

## 查看npm和yarn安装的依赖

```js
yarn global list --depth=0

npm list -g --depth=0
```

