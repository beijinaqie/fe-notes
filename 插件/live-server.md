# 利用 Live Server 开启本地服务器

`live-server` 在你项目目录中使用。 自动启动默认浏览器。当您更改任何文件时，浏览器将重新加载页面，除非它是CSS文件，否则在不重新加载的情况下应用更改。

配置参数:

- `--port=NUMBER` - 选择要使用的端口，默认8080
- `--host=ADDRESS` - 选择要绑定的主机地址，默认为:0.0.0.0（“任何地址”）
- `--no-browser` - 禁止自动启动Web浏览器
- `--browser=BROWSER` - 指定要使用的浏览器，而不是系统默认值
- `--quiet | -q` - 禁止记录
- `--verbose | -V` - 更多日志记录（记录所有请求，显示所有侦听的IPv4接口，等等）
- `--open=PATH` - 将浏览器启动到指定path而不是服务器根目录
- `--watch=PATH` - 以逗号分隔的路径字符串，专门用于监视更改（默认值：监视所有内容）
- `--ignore=PATH` - 逗号分隔的路径字符串，忽略（anymatch兼容定义）
- `--ignorePattern=RGXP` - 文件的正则表达式忽略（即.*.jade）（不推荐使用赞成--ignore）
- `--no-css-inject` - 在CSS更改时重新加载页面，而不是注入更改的CSS
- `--middleware=PATH` - 导出要添加的中间件功能的.js文件的路径；可以是没有路径的名称，也不能是引用middleware文件夹中捆绑的中间件的扩展名
- `--entry-file=PATH` - 提供此文件（相对于服务器根目录的文件）代替丢失的文件（对于单页应用程序很有用）
- `--mount=ROUTE:PATH` - 在定义的路线下提供路径内容（可能有多个定义）
- `--spa` - 将请求从/ abc转换为/＃/ abc（对于单页应用程序很方便）
- `--wait=MILLISECONDS` - (默认100ms）等待所有更改，然后重新加载
- `--htpasswd=PATH` - 启用位于PATH的http-auth的htpasswd文件
- `--cors` -为任何来源启用CORS（反映请求来源，支持带有凭据的请求）
- `--https=PATH` - HTTPS配置模块的路径
- `--https-module=MODULE_NAME` - 自定义HTTPS模块（例如spdy）
- `--proxy=ROUTE:URL` - 将所有对ROUTE的请求代理到URL
- `--help | -h` - 显示简洁的提示
- `--version | -v` - 显示版本