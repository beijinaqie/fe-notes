### 3.2 前端使用mockjs拦截请求,制造数据

- 注: 使用该方法拦截ajax请求, 返回数据, 但是不会发网络请求.

1. 安装

   ```js
   npm install mockjs
   ```

2. 配置

   为了只在开发环境使用mock.js，而打包到生产环境时自动不使用mock.js，做以下配置： 

   ```js
   // .env.development文件中
   VUE_APP_MOCK= true
   
   // mian.js中
   JSON.parse(process.env.VUE_APP_MOCK) && require('./mock/index.js');
   ```

3. 创建文件

   - mock/index.js

   ```js
   // 首先引入Mock
   import Mock from 'mockjs';
   
   // 设置拦截ajax请求的相应时间
   Mock.setup({
     timeout: '200-600'
   });
   
   let configArray = [];
   
   // 使用webpack的require.context()遍历所有mock文件
   const files = require.context('.', true, /\.js$/);
   files.keys().forEach((key) => {
     if (key === './index.js') return;
     configArray = configArray.concat(files(key).default);
   });
   
   // 注册所有的mock服务
   configArray.forEach((item) => {
     for (let [path, target] of Object.entries(item)) {
       let protocol = path.split('|');
       Mock.mock(new RegExp('^' + protocol[1]), protocol[0], target);
     }
   });
   
   ```

   - mock/demoList.js

   ```js
   // 在mock文件夹下随便创建一个文件demoList.js
   let demoList = {
       status: 200,
       message: 'success',
       data: [{
           id: 1,
           name: 'zs',
           age: '23',
           job: '前端工程师'
       },{
           id: 2,
           name: 'ww',
           age: '24',
           job: '后端工程师'
       }]
   };
   let demoList2 = [{
           id: 1,
           name: 'zs',
           age: '23',
           job: '前端工程师'
       },{
           id: 2,
           name: 'ww',
           age: '24',
           job: '后端工程师'
       }];
   export default {
       'get|/parameter/query': demoList,
         // 也可以这样写
         // 官方解释为：记录用于生成响应数据的函数。当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。
       'get|/parameter/query': (option) => {
         // 可以在这个地方对demoList2进行一系列操作，例如增删改
         // option 指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性
         return {
               status: 200,
               message: 'success',
               data: demoList2
           };
     }
   }
   ```

   - mock/market.js(直接使用后端返回数据)

   ```js
   //接口响应体中复制数据
   const demoList2 = {
     
   };
   export default {
     // 'get|/parameter/query': demoList,
     // 也可以这样写
     // 官方解释为：记录用于生成响应数据的函数。当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。
     'get|/v1.0.0/market/home': (option) => {
       console.log('调用mock数据');
       // 可以在这个地方对demoList2进行一系列操作，例如增删改
       // option 指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性
       return demoList2;
     }
   };
   
   ```

4. 页面使用

   ```js
    this.$axios.get('/parameter/query')
   ```

# 