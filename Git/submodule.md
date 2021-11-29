[toc]

> 多项目开发时，可能会存在共同的一些类库，比如方法或者ui库组件等，如果只是单纯的复制、拷贝，一来项目多，复制黏贴的次数多，而且很可能出现遗漏，二来，如果更新了公共类库，其它项目也需要同步更新，为了解决此类痛点，`submodule`出现，`submodule`允许你将一个Git 仓库当作另外一个Git 仓库的子目录。这允许你克隆另外一个仓库到你的项目中并且保持你的提交相对独立。

# 命令

## 在已有项目内添加子模块(需父项目内没有该模块)

```js
git submodule add [remote url] // 直接clone，会在当前目录生成一个someSubmodule目录存放仓库内容
git submodule add [remote url] [path 如modules/web-base] // 指定目录下载
```

添加完之后，子模块目录还是空的（似乎新版不会了），此时需要执行：

```js
git submodule update --init --recursive
```

## Clone时子模块初始化(父项目内已有对应子模块记录)

`clone`父仓库的时候加上`--recursive`，会自动初始化并更新仓库中的每一个子模块

```js
git clone [remote url] --recursive
```

如果已经正常的`clone`了，那也可以做以下补救：

```js
git submodule init
git submodule update
```

正常`clone`包含子模块的函数之后，由于.submodule文件的存在`someSubmodule`已经自动生成，但是里面是空的。上面的两条命令分别：

1. 初始化的本地配置文件
2. 从该项目中抓取所有数据并检出到主项目中

## 更新

```js
git submodule update // 更新项目内子模块到最新版本
git submodule update --remote [子模块] // 更新子模块为远程项目的最新版本
```

Git 将会进入所有子模块，分别抓取并更新，默认更新master分支。

不带`--remote`的`update`只会在本地没有子模块或它是空的的时候才会有效果

## 修改子模块

进入对应子模块后，进行正常的修改，推送

```js
git add .
git commit -m "change"
git push origin master
```

## 删除子模块

有时子模块的项目维护地址发生了变化，或者需要替换子模块，就需要删除原有的子模块。

### 第一种

删除子模块较复杂，步骤如下：

```js
rm -rf 子模块目录 // 删除子模块目录及源码
vi .gitmodules // 删除项目目录下.gitmodules文件中子模块相关条目
vi .git/config // 删除配置项中子模块相关条目
rm .git/module/* // 删除模块下的子模块目录，每个子模块对应一个目录，注意只删除对应的子模块目录即可
执行完成后，再执行添加子模块命令即可，如果仍然报错，执行如下：*/

git rm --cached [子模块] // 删除缓存的子模块名称
```

完成删除后，提交到仓库即可。

### 第二种

```js
# common 为模块的目录名字
# 1. 逆初始化模块, 执行后子模块目录将被删除
git submodule deinit [模块名]

# 2. 清除子模块缓存
git rm --cached [模块名]

# 3. 提交代码并推送
git commit -am "Remove a submodule" && git push
```

