```js
// 封装的axios请求
import Vue from 'vue';
import axios from 'axios';
import { Toast } from 'mint-ui';

const Axios = axios.create({
	baseURL:'',
	headers:{ 'Content-Type':'application/json' },
	timeout:3000
})
// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if(config.method === 'get' && config.data) {
		config.params = config.data
  	}
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


function fetch(method,url,data,config={}){
	return new Promise((resolve,reject)=>{
		Axios({
			method:method,
			url:url,
			data:data,
			...config
		}).then(res=>{
			if(res.status==200&&res.data){
				resolve(res.data)
			}else{
				Toast(res.data.msg||'服务器错误!');
			}
		}).catch(err=>{
			Toast(res.data.msg||'服务器错误!');
			reject(err)
		})
	})
}

export default{
	install(Vue,option){
//		Object.defineProperty(Vue.prototype,'$http',{ value:fetch })
		Vue.prototype.$http = fetch;
	}
}
```

