# Koa-body 和koa-bodypaser相似，但koa-body更加强大

+ 默认不支持get, head,delete

```js
app.use(koaBody({
    multipart: true,
    strict  : false,  //如果为true，不解析GET,HEAD,DELETE请求
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));
```

+ 解析文件

```js
ctx.request.files
```

