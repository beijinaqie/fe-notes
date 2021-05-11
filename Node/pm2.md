PM2是node进程管理工具，可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单。
 下面就对PM2进行入门性的介绍，基本涵盖了PM2的常用的功能和配置。

## 安装 PM2

```bash
$ npm install pm2 -g
```

## 启动一个应用程序

```bash
$ pm2 start app.js
```

## 更新 PM2

```bash
# 安装最新的pm2
$ pm2 save # 记得保存进程状态
$ npm install pm2 -g
$ pm2 update
```

## 目录介绍

pm2安装好后，会自动创建下面目录。看文件名基本就知道干嘛的了，就不翻译了。

- `$HOME/.pm2` will contain all PM2 related files
- `$HOME/.pm2/logs` will contain all applications logs
- `$HOME/.pm2/pids` will contain all applications pids
- `$HOME/.pm2/pm2.log` PM2 logs
- `$HOME/.pm2/pm2.pid` PM2 pid
- `$HOME/.pm2/rpc.sock` Socket file for remote commands
- `$HOME/.pm2/pub.sock` Socket file for publishable events
- `$HOME/.pm2/conf.js` PM2 Configuration

## 入门教程

挑我们最爱的express应用来举例。一般我们都是通过`npm start`启动应用，其实就是调用`node ./bin/www`。那么，换成pm2就是

注意，这里用了`--watch`参数，意味着当你的express应用代码发生变化时，pm2会帮你重启服务，多贴心。

```bash
pm2 start ./bin/www --watch
```

入门太简单了，没什么好讲的。直接上官方文档：[http://pm2.keymetrics.io/docs/usage/quick-start](https://links.jianshu.com/go?to=http%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fquick-start)

## 常用命令

### 启动

参数说明：

- `--watch`：监听应用目录的变化，一旦发生变化，自动重启。如果要精确监听、不见听的目录，最好通过配置文件。
- `-i --instances`：启用多少个实例，可用于负载均衡。如果`-i 0`或者`-i max`，则根据当前机器核数确定实例数目。
- `--ignore-watch`：排除监听的目录/文件，可以是特定的文件名，也可以是正则。比如`--ignore-watch="test node_modules "some scripts""`
- `-n --name`：应用的名称。查看应用信息的时候可以用到。
- `-o --output <path>`：标准输出日志文件的路径。
- `-e --error <path>`：错误输出日志文件的路径。
- `--interpreter <interpreter>`：the interpreter pm2 should use for executing app (bash, python...)。比如你用的coffee script来编写应用。

完整命令行参数列表：[地址](https://links.jianshu.com/go?to=http%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fquick-start%2F%23options)

```bash
pm2 start app.js --watch -i 2
```

### 重启

```bash
pm2 restart app.js
```

### 停止

停止特定的应用。可以先通过`pm2 list`获取应用的名字（--name指定的）或者进程id。

```bash
pm2 stop app_name|app_id
```

如果要停止所有应用，可以

```bash
pm2 stop all
```

### 删除

类似`pm2 stop`，如下

```bash
pm2 stop app_name|app_id
pm2 stop all
```

### 查看进程状态

```bash
pm2 list
```

### 查看某个进程的信息

```bash
[root@iZ94wb7tioqZ pids]# pm2 describe 0
Describing process with id 0 - name oc-server
┌───────────────────┬──────────────────────────────────────────────────────────────┐
│ status            │ online                                                       │
│ name              │ oc-server                                                    │
│ id                │ 0                                                            │
│ path              │ /data/file/qiquan/over_the_counter/server/bin/www            │
│ args              │                                                              │
│ exec cwd          │ /data/file/qiquan/over_the_counter/server                    │
│ error log path    │ /data/file/qiquan/over_the_counter/server/logs/app-err-0.log │
│ out log path      │ /data/file/qiquan/over_the_counter/server/logs/app-out-0.log │
│ pid path          │ /root/.pm2/pids/oc-server-0.pid                              │
│ mode              │ fork_mode                                                    │
│ node v8 arguments │                                                              │
│ watch & reload    │                                                              │
│ interpreter       │ node                                                         │
│ restarts          │ 293                                                          │
│ unstable restarts │ 0                                                            │
│ uptime            │ 87m                                                          │
│ created at        │ 2016-08-26T08:13:43.705Z                                     │
└───────────────────┴──────────────────────────────────────────────────────────────┘
```

## 配置文件

### 简单说明

- 配置文件里的设置项，跟命令行参数基本是一一对应的。
- 可以选择`yaml`或者`json`文件，就看个人洗好了。
- `json`格式的配置文件，pm2当作普通的js文件来处理，所以可以在里面添加注释或者编写代码，这对于动态调整配置很有好处。
- 如果启动的时候指定了配置文件，那么命令行参数会被忽略。（个别参数除外，比如--env）

### 例子

举个简单例子，完整配置说明请参考[官方文档](https://links.jianshu.com/go?to=http%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fpm2-doc-single-page%2F)。

```json
{
  "name"        : "fis-receiver",  // 应用名称
  "script"      : "./bin/www",  // 实际启动脚本
  "cwd"         : "./",  // 当前工作路径
  "watch": [  // 监控变化的目录，一旦变化，自动重启
    "bin",
    "routers"
  ],
  "ignore_watch" : [  // 从监控目录中排除
    "node_modules", 
    "logs",
    "public"
  ],
  "watch_options": {
    "followSymlinks": false
  },
  "error_file" : "./logs/app-err.log",  // 错误日志路径
  "out_file"   : "./logs/app-out.log",  // 普通日志路径
  "env": {
      "NODE_ENV": "production"  // 环境参数，当前指定为生产环境
  }
}
```

## 自动重启

前面已经提到了，这里贴命令行，更多点击[这里](https://links.jianshu.com/go?to=http%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fwatch-and-restart%2F%23auto-restart-apps-on-file-change)。

```bash
pm2 start app.js --watch
```

这里是监控整个项目的文件，如果只想监听指定文件和目录，建议通过配置文件的`watch`、`ignore_watch`字段来设置。

## 环境切换

在实际项目开发中，我们的应用经常需要在多个环境下部署，比如开发环境、测试环境、生产环境等。在不同环境下，有时候配置项会有差异，比如链接的数据库地址不同等。

对于这种场景，pm2也是可以很好支持的。首先通过在配置文件中通过`env_xx`来声明不同环境的配置，然后在启动应用时，通过`--env`参数指定运行的环境。

### 环境配置声明

首先，在配置文件中，通过`env`选项声明多个环境配置。简单说明下：

- `env`为默认的环境配置（生产环境），`env_dev`、`env_test`则分别是开发、测试环境。可以看到，不同环境下的`NODE_ENV`、`REMOTE_ADDR`字段的值是不同的。
- 在应用中，可以通过`process.env.REMOTE_ADDR`等来读取配置中生命的变量。

```json
  "env": {
    "NODE_ENV": "production",
    "REMOTE_ADDR": "http://www.example.com/"
  },
  "env_dev": {
    "NODE_ENV": "development",
    "REMOTE_ADDR": "http://wdev.example.com/"
  },
  "env_test": {
    "NODE_ENV": "test",
    "REMOTE_ADDR": "http://wtest.example.com/"
  }
```

### 启动指明环境

假设通过下面启动脚本（开发环境），那么，此时`process.env.REMOTE_ADDR`的值就是相应的 [http://wdev.example.com/](https://links.jianshu.com/go?to=http%3A%2F%2Fwdev.example.com%2F) ，可以自己试验下。

```bash
pm2 start app.js --env dev
```

## 负载均衡

命令如下，表示开启三个进程。如果`-i 0`，则会根据机器当前核数自动开启尽可能多的进程。

```bash
pm2 start app.js -i 3 # 开启三个进程
pm2 start app.js -i max # 根据机器CPU核数，开启对应数目的进程 
```

参考文档：[点击查看](https://links.jianshu.com/go?to=http%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fcluster-mode%2F%23automatic-load-balancing)

## 日志查看

除了可以打开日志文件查看日志外，还可以通过`pm2 logs`来查看实时日志。这点对于线上问题排查非常重要。

比如某个node服务突然异常重启了，那么可以通过pm2提供的日志工具来查看实时日志，看是不是脚本出错之类导致的异常重启。

```bash
pm2 logs
```

## 指令tab补全

运行`pm2 --help`，可以看到`pm2`支持的子命令还是蛮多的，这个时候，自动完成的功能就很重要了。

运行如下命令。恭喜，已经能够通过tab自动补全了。细节可参考[这里](https://links.jianshu.com/go?to=http%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fauto-completion%2F)。

```bash
pm2 completion install
source ~/.bash_profile
```

## 开机自动启动

可以通过`pm2 startup`来实现开机自启动。细节可[参考](https://links.jianshu.com/go?to=http%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fstartup%2F)。大致流程如下

1. 通过`pm2 save`保存当前进程状态。
2. 通过`pm2 startup [platform]`生成开机自启动的命令。（记得查看控制台输出）
3. 将步骤2生成的命令，粘贴到控制台进行，搞定。

## 传入node args

直接上例子，分别是通过命令行和配置文件。

命令行：

```bash
pm2 start app.js --node-args="--harmony"
```

配置文件：

```json
{
  "name" : "oc-server",
  "script" : "app.js",
  "node_args" : "--harmony"
}
```

### 实例说明

假设是在`centos`下，那么运行如下命令，搞定。强烈建议运行完成之后，重启机器，看是否设置成功。

```bash
[root@iZ94wb7tioqZ option_analysis]# pm2 save
[root@iZ94wb7tioqZ option_analysis]# pm2 startup centos
[PM2] Generating system init script in /etc/init.d/pm2-init.sh
[PM2] Making script booting at startup...
[PM2] /var/lock/subsys/pm2-init.sh lockfile has been added
[PM2] -centos- Using the command:
      su -c "chmod +x /etc/init.d/pm2-init.sh; chkconfig --add pm2-init.sh"

[PM2] Done.
[root@iZ94wb7tioqZ option_analysis]# pm2 save
[PM2] Dumping processes
```

## 监控(monitor)

运行如下命令，查看当前通过pm2运行的进程的状态。

```bash
pm2 monit
```

看到类似输出

```bash
[root@oneday-dev0 server]# pm2 monit
⌬ PM2 monitoring (To go further check out https://app.keymetrics.io) 
                                       [                              ] 0 %
⌬ PM2 monitoring (To go further check o[|||||||||||||||               ] 196.285 MB  

 ● fis-receiver                        [                              ] 0 %
[1] [fork_mode]                        [|||||                         ] 65.773 MB  

 ● www                                 [                              ] 0 %
[2] [fork_mode]                        [|||||                         ] 74.426 MB  

 ● oc-server                           [                              ] 0 %
[3] [fork_mode]                        [||||                          ] 57.801 MB  

 ● pm2-http-interface                  [                              ] stopped
[4] [fork_mode]                        [                              ] 0 B   

 ● start-production
[5] [fork_mode]
```

## 内存使用超过上限自动重启

如果想要你的应用，在超过使用内存上限后自动重启，那么可以加上`--max-memory-restart`参数。（有对应的配置项）

```bash
pm2 start big-array.js --max-memory-restart 20M
```

### 常用命令一览

```bash
# 普通 General
$ npm install pm2 -g            # 安装 PM2
$ pm2 start app.js              # 启动，守护进程，自动重启应用程序 Start, Daemonize and auto-restart application (Node)
$ pm2 start app.py              # 启动，守护进程，自动重启python应用程序 Start, Daemonize and auto-restart application (Python)
$ pm2 start npm -- start        # 启动，守护进程，自动重启node应用程序 Start, Daemonize and auto-restart Node application

# 集群模式 (只支持node进程) Cluster Mode (Node.js only)
$ pm2 start app.js -i 4         # 在集群模式下，启动4个应用程序实例  Start 4 instances of application in cluster mode
                                # 同时，将网络请求，负载均衡到每个应用实例  it will load balance network queries to each app
$ pm2 reload all                # 0秒重启所有应用 Zero Second Downtime Reload
$ pm2 scale [app-name] 10       # 将应用进程调整到10 Scale Cluster app to 10 process

# 进程监控 Scale Cluster app to 10 process
$ pm2 list                      # 列出所有用PM2启动的进程 List all processes started with PM2
$ pm2 monit                     # 显示每个应用占用的cpu和内存 Display memory and cpu usage of each app
$ pm2 show [app-name]           # 显示某个进程的所有信息 Show all informations about application

# 日志管理 Log management
$ pm2 logs                      # 显示所有应用的日志  Display logs of all apps
$ pm2 logs [app-name]           # 显示某个应用的日志 Display logs for a specific app
$ pm2 logs --json               # json化日志 Logs in JSON format
$ pm2 flush
$ pm2 reloadLogs

# 进程状态管理 Process State Management
$ pm2 start app.js --name="api" # 启动一个应用并命名为api。 Start application and name it "api"
$ pm2 start app.js -- -a 34     # 启动一个应用，并传递“-a 34”的参数。 Start app and pass option "-a 34" as argument
$ pm2 start app.js --watch      # 重启一个应用，当文件改变的时候。Restart application on file change
$ pm2 start script.sh           # 启动一个bash脚本。Start bash script
$ pm2 start app.json            # 启动在app.json中声明的所有应用。Start all applications declared in app.json
$ pm2 reset [app-name]          # 重置所有计数器。Reset all counters
$ pm2 stop all                  # 停止所有应用。Stop all apps
$ pm2 stop 0                    # 停止id 为0的应用。Stop process with id 0
$ pm2 restart all               # 重启所有应用。Restart all apps
$ pm2 gracefulReload all        # 在集群模式下，平稳的重加载所有应用。Graceful reload all apps in cluster mode
$ pm2 delete all                # 杀掉所有应用。Kill and delete all apps
$ pm2 delete 0                  # 杀掉id为0的进程。Delete app with id 0

# 启动／引导管理 Startup/Boot management
$ pm2 startup                   # 检测init系统，在启动时生成和配置pm2。Detect init system, generate and configure pm2 boot on startup
$ pm2 save                      # 保存当前进程列表。Save current process list
$ pm2 resurrect                 # 恢复以前保存的进程。Restore previously save processes
$ pm2 unstartup                 # 停用和删除启动系统。Disable and remove startup system
$ pm2 update                    # 保存进程，终止PM2并恢复进程。Save processes, kill PM2 and restore processes
$ pm2 generate                  # 生成样本json配置文件。Generate a sample json configuration file

# 部署 Deployment
$ pm2 deploy app.json prod setup    # 设置“生产环境”远程服务器。 Setup "prod" remote server
$ pm2 deploy app.json prod          # 更新“生产环境”远程服务器。 Update "prod" remote server
$ pm2 deploy app.json prod revert 2 # 将“生产环境”远程服务器恢复2。Revert "prod" remote server by 2

# 模块系统 Module system
$ pm2 module:generate [name]    # 生成名称为[name]的示例模块。Generate sample module with name [name]
$ pm2 install pm2-logrotate     # 安装模块（这里是日志循环系统）。Install module (here a log rotation system)
$ pm2 uninstall pm2-logrotate   # 卸载模块。Uninstall module
$ pm2 publish                   # 增量版本，git push和npm发布。Increment version, git push and npm publish
```

### 进程管理

列出正在运行的应用程序

```bash
$ pm2 list
```

很简单的管理你的应用进程

```bash
$ pm2 stop     <app_name|id|'all'|json_conf>
$ pm2 restart  <app_name|id|'all'|json_conf>
$ pm2 delete   <app_name|id|'all'|json_conf> 
```

### CPU/进程监控

监控所有启动的进程：

```bash
$ pm2 monit
```

### 日志设施

实时显示指定进程或所有进程的日志。提供标准，原始，JSON和格式输出。

```bash
$ pm2 logs ['all'|app_name|app_id] [--json] [--format] [--raw]`
```

例子:

```bash
$ pm2 logs APP-NAME       # Display APP-NAME logs
$ pm2 logs --json         # JSON output
$ pm2 logs --format       # Formated output

$ pm2 flush               # Flush all logs
$ pm2 reloadLogs          # Reload all logs
```

### 生成启动脚本

```bash
/* PM2可以生成和配置启动脚本，以在每次服务器重新启动时保持PM2和您的进程活动。
支持init系统，如：systemd（Ubuntu 16，CentOS，Arch），upstart（Ubuntu 14/12），launchd（MacOSx，Darwin），rc.d（FreeBSD）。
自动检测init系统+在服务器启动时生成和设置PM2引导。 Auto detect init system + generate and setup PM2 boot at server startup */
$ pm2 startup

# 手动指定启动系统. Manually specify the startup system
# 可以是：systemd，upstart，launchd，rcd。
$ pm2 startup [platform]

# 在服务器启动时禁用和删除PM2引导。Disable and remove PM2 boot at server startup
$ pm2 unstartup
```

在重新启动时保存/冻结进程列表：

```bash
$ pm2 save
```

## 模块系统 Module system

PM2嵌入了一个简单而强大的模块系统。安装模块很简单：

```bash
$ pm2 install <module_name>
```

### 配置pm2启动文件

```js
{
    "apps": [
      // 一个对象就是一个node程序
      {
        "name": "wuwu",                             // 项目名          
        "script": "./bin/www",                      // 执行文件
        "cwd": "./",                                // 根目录
        "args": "",                                 // 传递给脚本的参数
        "interpreter": "",                          // 指定的脚本解释器
        "interpreter_args": "",                     // 传递给解释器的参数
        "watch": true,                              // 是否监听文件变动然后重启
        "ignore_watch": [                           // 不用监听的文件
            "node_modules",
            "logs"
        ],
        "exec_mode": "cluster_mode",                // 应用启动模式，支持fork和cluster模式
        "instances": 4,                             // 应用启动实例个数，仅在cluster模式有效 默认为fork；或者 max
        "max_memory_restart": 8,                    // 最大内存限制数，超出自动重启
        "error_file": "./logs/app-err.log",         // 错误日志文件
        "out_file": "./logs/app-out.log",           // 正常日志文件
        "merge_logs": true,                         // 设置追加日志而不是新建日志
        "log_date_format": "YYYY-MM-DD HH:mm:ss",   // 指定日志文件的时间格式
        "min_uptime": "60s",                        // 应用运行少于时间被认为是异常启动
        "max_restarts": 30,                         // 最大异常重启次数，即小于min_uptime运行时间重启次数；
        "autorestart": true,                        // 默认为true, 发生异常的情况下自动重启
        "cron_restart": "",                         // crontab时间格式重启应用，目前只支持cluster模式;
        "restart_delay": 10                      // 异常重启情况下，延时重启时间
        "env": {
           "NODE_ENV": "production",                // 环境参数，当前指定为生产环境 process.env.NODE_ENV
           "REMOTE_ADDR": "爱上大声地"               // process.env.REMOTE_ADDR
        },
        "env_dev": {
            "NODE_ENV": "development",              // 环境参数，当前指定为开发环境 pm2 start app.js --env_dev
            "REMOTE_ADDR": ""
        },
        "env_test": {                               // 环境参数，当前指定为测试环境 pm2 start app.js --env_test
            "NODE_ENV": "test",
            "REMOTE_ADDR": ""
        }
    }
   ]
}
```

