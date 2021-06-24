```nginx
nginx -t // 检查nginx配置文件
nginx -t -c /path/to/nginx.conf // 检查指定目录下的配置文件
nginx -s reload  // 修改配置后重新加载生效
nginx -s stop  // 快速停止nginx 此方式相当于先查出nginx进程id再使用kill命令强制杀掉进程。
start nginx // 启动nginx
```

