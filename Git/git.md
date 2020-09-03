[toc]

# 解决git pull/push每次都需要输入密码问题

```js
如果我们git clone的下载代码的时候是连接的https://而不是git@git (ssh)的形式，当我们操作git pull/push到远程的时候，总是提示我们输入账号和密码才能操作成功，频繁的输入账号和密码会很麻烦。
解决办法：
git bash进入你的项目目录，输入：
git config --global credential.helper store
然后你会在你本地生成一个文本，上边记录你的账号和密码。当然这些你可以不用关心。
然后你使用上述的命令配置好之后，再操作一次git pull，然后它会提示你输入账号密码，这一次之后就不需要再次输入密码了。
```

# git 命令操作

```js
git clone 远程仓库地址		将远程的代码下到本地
git pull origin 分支		更新某个分支的代码
git branch 				查看本地分支
git branch 分支			创建分支
git checkout 分支			切换分支
git checkout -b 分支		创建并切换分支
git checkout -- file	撤销对工作区修改
git branch -D 分支		删除本地分支
git push origin :分支		删除远程仓库分支 
git branch -l/-r/-a 	查看本地分支/查看远程分支/查看所有分支
git commit -m "注释"		提交代码到本地暂存区
git push origin 分支		提交代码到远程仓库 -f 强制提交覆盖 -u 记录git push 默认推送origin master
git config -l 			查看git配置信息
git remote show origin			查看某个远程仓库的详细信息
git status				查看状态
git log					查看提交历史信息
git reset --hard 版本号	没必要写完整，前几位就行(六七位),回退版本
git reset HEAD -- file	清空add命令向暂存区提交的关于file文件的修改
git reset HEAD^			已经提交了不合适的修改到版本库时，想要撤销本次提交
git reflog 				查看操作的git记录
git show 版本号			查看提交的内容
git diff 				不加参数即默认比较工作区与暂存区

用 git rm 来删除文件，同时还会将这个删除操作记录下来；
用 rm 来删除文件，仅仅是删除了物理文件，没有将其从 git 的记录中剔除。
直观的来讲，git rm 删除过的文件，执行 git commit -m "abc" 提交时，会自动将删除该文件的操作提交上去。
而用 rm 命令直接删除的文件，单纯执行 git commit -m "abc" 提交时，则不会将删除该文件的操作提交上去，需要在执行commit的时候，多加一个-a参数，
即rm删除后，需要使用git commit -am "abc"提交才会将删除文件的操作提交上去。

git把本地和线上回退到某个历史版本，然后再做提交到线上
git reset --hard 版本号
git push -f -u origin 分支	强行提交覆盖

设置Git的user name和email：
$ git config --global user.name "xxx"
$ git config --global user.email "xxx@xxx.com"
```

## git 打tag操作

```js
git tag // 打印查看所有tag
git tag -l 1.*.* // 帅选tag
git checkout tag // 切换tag
git tag 1.0.0 // 创建tag
git tag -a 1.0.0 -m "" // 创建tag并添加信息
git tag -a 1.0.0 oc3debf -m "" // 创建指定commit记录tag并添加信息
git tag -d 1.0.0 // 删除本地tag
git push origin --delete 1.0.0 // 删除远程仓库tag
git push origin 1.0.0 // 推送指定tag
git push origin --tags // 推送所有tag
git pull origin --tags //拉去远程所有tag 
```



## git 放弃本地修改，拉取远程仓库代码强制覆盖

```js
git fetch -a // 拉取远程仓库所有代码
git reset --hard origin/master // 把HEAD指向最新下载的版本
```



## 本地已有项目关联远程git仓库

```js
git remote add origin 远程仓库地址
git add . 添加本地暂存
git commit -m "" 添加本地仓库，并描述
git push origin master 推送到远程仓库
```



## 修改远程仓库地址

```js
git remote -v // 查看远程仓库地址 fetch和push
git remote set-url origin 远程地址 // 修改远程仓库地址
```





# 生成SSH密钥过程：

1. 查看是否已经有了ssh密钥： cd ~/.ssh
2. 进入ssh目录下查看key： cat id_rsa.pub
3. 如果没有密钥，生成密钥：ssh-keygen 

# 遇到程序卡死

:wq					解决冲突

