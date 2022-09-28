[toc]

# monorepo的概念

![](https://pic2.zhimg.com/v2-f613d8f44f104ce8282efa7afecb9d75_r.jpg)

**MonoLith：**一个项目，一个 Git 仓库。

- 优点：实现简单，一撸到底。
- 缺点：复杂项目代码复用性低，且不利于团队协作。

**Multi-Repo：**划分为多个模块，一个模块一个 Git 仓库

- 优点：模块划分清晰，每个模块都是独立的 repo，利于团队协作
- 缺点：代码管理难度增加。比如：1.某个模块出现bug 相应模块都需要编译、上线、涉及到手动控制版本非常繁琐。 2.issue 管理十分麻烦。

**Mono-Repo：**划分为多个模块，所有模块放在一个 Git 仓库

- 优点：代码结构清晰，利于团队协作，同时一个库降低了项目管理、代码管理以及代码调试难度。
- 缺点：项目变得庞大，模块变多后同样会遇到各种问题。所以需要有更好的构建工具支持。

# yarn workspace

#### yarn介绍及使用

1. yarn工作流
    yarn工作流与npm类似   都是使用package.json文件，yarn会重组node_modules文件,且不会与npm冲突，并会自动生成yarn.lock文件，保证团队依赖版本一致性，但如果之前使用了package-lock.json时，那么锁定的版本可能依然存在冲突的可能，这时需要团队之间同时切换到 Yarn；
2. yarn-cli命令行工具常见命令
    对于经常用到的项目初始化，对包的安装、卸载、升级、发布等操作，Yarn 都提供了丰富而简洁的命令：

workspace的介绍和使用。
 workspace是除缓存外yarn区别于npm最大的优势

1. workspace的作用：
    （1）. 能帮助你更好地管理多个子project的repo，这样你可以在每个子project里使用独立的package.json管理你的依赖，又不用分别进到每一个子project里去yarn install/upfrade安装/升级依赖，而是使用一条yarn命令去处理所有依赖就像只有一个package.json一样
    （2）. yarn会根据就依赖关系帮助你分析所有子project的共用依赖，保证所有的project公用的依赖只会被下载和安装一次。
2. workspace的使用
    yarn workspace并不需要安装什么其他的包，只需要简单的更改package.json便可以工作。 首先我们需要确定workspace root，一般来说workspace root都会是repo的根目录

- yarn workspace目录结构树:



![](https://upload-images.jianshu.io/upload_images/12564775-6eb7783e32e44b13.png?imageMogr2/auto-orient/strip|imageView2/2/w/921/format/webp)

- 你会发现整个repo只生成了一份yarn.lock，绝大多数的依赖包都被提升到了根目录下的node_modules之内。各个子project的node_modules里面不会重复存在依赖，只会有针对根目录下cross-env的引用。不仅如此，你会发现，对于repo内部的依赖关系（比如workspace-b依赖于workspace-a），yarn也能很好的进行管理。

1. workspace有哪些不足和限制
   1. yarn workspace并没有像lerna那样封装大量的高层API，整个workspace整体上还是依赖于整个yarn命令体系。
   2. workspace不能嵌套（只能有一个根workspace）
   3. workspace采用的是向上遍历，所以workspace并不能识别根workspace之外的依赖。

```cpp
// 常用
yarn install    // 安装依赖项
yarn workspaces run clean  // 清除项目中所有 node_modules
// yarn workspaces info
// yarn workspaces run

yarn add        // 添加 package
yarn init       // 初始化
yarn publish    // 发布
yarn remove     // 删除

yarn workspace  // 具体某个工作区 
// yarn workspace awesome-package add react react-dom --dev
```

Yarn 从 1.0 版开始支持 Workspace （工作区）

Workspace 能更好的统一管理有多个项目的仓库，既可在每个项目下使用独立的 package.json 管理依赖，又可便利的享受一条 yarn 命令安装或者升级所有依赖等。更重要的是可以使多个项目共享同一个 `node_modules` 目录，提升开发效率和降低磁盘空间占用。

```js
projects/
|--project1/
|  |--package.json
|  |--node_modules/
|  |  |--a/
|--project2
|  |--package.json
|  |--node_modules/
|  |  |--a/
|  |  |--project1/
```

**project1/package.json:**

```js
{
  "name": "project1",
  "version": "1.0.0",
  "dependencies": {
    "a": "1.0.0"
  }
}
```

**project2/package.json:**

```js
{
  "name": "project2",
  "version": "1.0.0",
  "dependencies": {
    "a": "1.0.0",
    "project1": "1.0.0"
  }
}
```

没有使用 [Yarn Workspace](https://links.jianshu.com/go?to=https%3A%2F%2Fclassic.yarnpkg.com%2Fen%2Fdocs%2Fcli%2Fworkspace%3A) 前，需要分别在 `project1` 和 `project2` 目录下分别执行 `yarn|npm install` 来安装依赖包到各自的 `node_modules` 目录下。或者使用 `yarn|npm upgrade` 来升级依赖的包。

这会产生很多不良的问题：

1. 如果 project1 和 project2 有相同的依赖项目 a，a 都会各自下载一次，这不仅耗时降低开发效率，还额外占用重复的磁盘空间；当 project 项目比较多的时候，此类问题就会显得十分严重。

2. 如果 project2 依赖 project1，而 project1 并没有发布到 npm 仓库，只是一个本地项目，有两种方式配置依赖：

   1. 使用相对路径（如 file: 协议）在 project2 中指定 project1 的依赖。
   2. 使用 `yarn|npm link` 来配置依赖。

   > 第 1 种方式缺少版本号的具体指定，每次发布版本时都需要相应的依赖版本的修改；第 2 种方式需要自行手工操作，配置复杂易出错。

   > 需要 npm-2.0.0+ 才支持模块间的相对路径依赖，详见 npm 官方文档 [package.json/Local Paths](https://links.jianshu.com/go?to=https%3A%2F%2Fdocs.npmjs.com%2Ffiles%2Fpackage.json%23local-paths)

3. 没有一个统一的地方对全部项目进行统一构建等，需要到各个项目内执行 `yarn|npm build` 来构架项目。

使用 [Yarn Workspace](https://links.jianshu.com/go?to=https%3A%2F%2Fclassic.yarnpkg.com%2Fen%2Fdocs%2Fcli%2Fworkspace%3A) 之后，上述问题都能得到很好的解决。而且这是 Yarn 内置的功能，并不需要安装什么其他的包，只需要简单的在 projects 目录（Yarn 称之为 workspace-root）下增加如下内容的 package.json 文件即可

**projects/package.json：**



```json
{
  "private": true,
  "workspaces": ["project1", "project2"] // 也可以使用通配符设置为 ["project*"]
}
```

> 开源社区则都基本上使用 `"workspaces": ["packages/*"]` 的目录结构，这与 [Lerna](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Flerna%2Flerna) 的目录结构一致。

在 workspace-root 目录下执行 `yarn install`：



```shell
$ cd projects
$ rm -r project1/node_modules
$ rm -r project2/node_modules

$ yarn install
yarn install v1.22.0
info No lockfile found.
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
success Saved lockfile.
✨  Done in 0.56s.
```

此时查看目录结构如下：



```txt
projects/
|--package.json
|--project1/
|  |--package.json
|--project2
|  |--package.json
|--node_modules/
|  |--a/
|  |--project1/ -> ./project1/
```

说明：

- projects 是各个子项目的上级目录，术语上称之为 **workspace-root**，而 project1 和 project2 术语上称之为 **workspace**。

- `yarn install` 命令既可以在 workspace-root 目录下执行，也可以在任何一个 workspace 目录下执行，效果是一样的。

- 如果需要某个特殊的 workspace 不受 

  Yarn Workspace

   管理，只需在此 workspace 目录下添加 

  ```
  .yarnrc
  ```

   文件，并添加如下内容禁用即可：

  

  ```bash
  workspaces-experimental false
  ```

- 在 project1 和 project2 目录下并没有 node_modules 目录（特殊情况下才会有，如当 project1 和 project2 依赖了不同版本的 a 时）。

- `/node_modules/project1` 是 `/project1` 的软链接，软链接的名称使用的是 `/project1/package.json#name` 属性的值。

- 如果只是修改单个 workspace，可以使用 `--focus` 参数来快速安装相邻的依赖配置从而避免全部安装一次。

## 2. 可用的 [Yarn Workspace](https://links.jianshu.com/go?to=https%3A%2F%2Fclassic.yarnpkg.com%2Fen%2Fdocs%2Fcli%2Fworkspace%3A) 命令

### 2.1. [yarn workspace  ](https://links.jianshu.com/go?to=https%3A%2F%2Fclassic.yarnpkg.com%2Fen%2Fdocs%2Fcli%2Fworkspace)

针对特定的 workspace 执行指定的 `<command>`，如：



```csharp
$ yarn workspace project1 add vue --dev 《 往 project1 添加 vue 开发依赖
$ yarn workspace project1 remove vue    《 从 project1 移除 vue 依赖
```

在 `{workspace}/package.json#scripts` 中定义的脚本命令，也可以作为 `<command>` 来执行。

下面是一个利用这个特点创建统一构建命令的例子：

**projects/package.json:**



```json
{
  "scripts": {
    "build": "yarn workspaces run build"
  }
}
```

**project1|project2/package.json:**



```json
{
  "scripts": {
    "build": "rollup -i index.js -f esm -o dist/bundle.js"
  }
}
```

执行 `yarn build` 的结果：



```ruby
$ yarn build
yarn run v1.22.0
$ yarn workspaces run build

> project1
$ rollup -i index.js -f esm -o dist/bundle.js

index.js → dist/bundle.js...
created dist/bundle.js in 70ms

> project2
$ rollup -i index.js -f esm -e project1 -o dist/bundle.js

index.js → dist/bundle.js...
created dist/bundle.js in 80ms
✨  Done in 2.45s.
```

### 2.2. [yarn workspaces ](https://links.jianshu.com/go?to=https%3A%2F%2Fclassic.yarnpkg.com%2Fen%2Fdocs%2Fcli%2Fworkspaces)

#### 2.2.1. `yarn workspaces run <command>`

在每个 workspace 下执行 `<command>`。如：



```bash
yarn workspaces run test
```

将会执行各个 workspace 的 test script。

#### 2.2.2. `yarn workspaces info [--json]`

显示当前各 workspace 之间的依赖关系树。



```ruby
$ yarn workspaces info
yarn workspaces v1.21.1
{
  "project1": {
    "location": "project1",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "project2": {
    "location": "project2",
    "workspaceDependencies": [
      "project1"
    ],
    "mismatchedWorkspaceDependencies": []
  }
}
✨  Done in 0.12s.
```

相关源代码已放在 Github 上，详见[这里](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fstart-nodejs%2Fyarn-workspace)。

# lerna

```cpp
// 常用
lerna bootstrap  // 安装所有依赖项并链接任何交叉依赖项
//例: lerna bootstrap --npm-client yarn --use-workspaces

lerna exec       // 在每个包中执行任意命令
//例: lerna exec 'yarn remove lodash' // 删除

lerna add        // 安装依赖，支持交叉依赖
// lerna add packageA --scope=packageB

// 版本发布
lerna changed    // 检查自上次发布以来哪些软件包已经更新
lerna diff       // 自上次发布以来，对所有包或单个包进行区分
lerna publish    // 发布版本

// 常用
lerna clean      // 清除项目中所有 node_modules
lerna init       // 初始化项目
lerna create     // 创建项目中的子package

// 其它
lerna run        // 在包含该脚本的包中运行 npm 脚本
lerna info       // 查看信息
lerna import     // 导入
lerna link       // 软链
lerna version    // 查看版本
lerna ls         // 列出当前 lerna 项目中的公共包
```

#### `lerna init`

创建一个新的 lerna 仓库或更新已有仓库为新版本的 lerna，其中的选项 `--independent/-i` 用来生成 `independent` 模式的项目。

#### `lerna bootstrap`

此命令会做以下几个事情：

1. npm install 为所有的包安装依赖。
2. 为互相依赖的包创建软链接。
3. 在所有 bootstrap 包（不包括 `command.bootstrap.ignore` 中忽略的包）中执行 `npm run prepublish`（如果传了参数 `--ignore-prepublish` 将跳过此步骤）。
4. 在所有 bootstrap 包（不包括 `command.bootstrap.ignore` 中忽略的包）中执行 `npm run prepare`。

#### `lerna publish`

发布所有修改过的包，会在终端提示(prompt)选择一个新版本，并会更新所有改动到 Git 和 npm.

#### `lerna run [script]`

在所有包中执行特定的 [npm script](https://link.juejin.cn?target=https%3A%2F%2Fdocs.npmjs.com%2Fmisc%2Fscripts)。

#### `lerna ls`

列出当前仓库中的所有公共包（public packages），`private: true` 的包不会列出。

### lerna.json

`lerna.json` 内容大致如下

```
{
  "version": "1.1.3",
  "npmClient": "npm",
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"],
      "message": "chore(release): publish",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
复制代码
```

- `version`: 当前仓库的版本。
- `npmClient`: 使用的 npm 客户端，默认是 "npm",可选值还有 "yarn"。
- `command.publish.ignoreChanges`: 是个数组，在这个数组里面的文件变动，不会触发版本更新。
- `command.publish.message`: 自定义发布新版本时的 git commit 信息。
- `command.publish.registry`: 设置私有仓库，默认是发布到 `npmjs.org`。
- `command.bootstrap.ignore`: 设置在这里的目录将不会参与 `lerna bootstrap`。
- `command.bootstrap.npmClientArgs`: 执行 `lerna bootstrap` 时会将此数组的所有值当作参数传给 `npm install`。
- `command.bootstrap.scope`: 限制 `lerna bootstrap` 在哪些包起作用。
- `packages`: 用以指明所有包的路径。

