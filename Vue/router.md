- vue清除路由

```js
this.$router.matcher = new Router({
  mode: 'history',
  routes // 此为清除后的路由重设 也可通过this.$router.addRoutes()添加路由
}).matcher
```



```js
//路由懒加载
1、const 路由名 = () => import(路径);
2、const GonglueDetail  = resolve => require(['@/home/tuijiangonglueDetail'], resolve)
//在路由里定义所需要的数据
{
	path:'/home',
	name:'home',
	meta:{
		keepAlive:true,
		title:'首页'
	},
 	component:Home
},
//路由拦截	做登录跳转判断
router.beforeEach((to,from,next)=>{
	if(to.meta.title){
		document.title = to.meta.title
	}else{
		document.title = ''
	}
	if(to.matched.some(res=>res.meta.requireAuth)){
		if(localStorage.getItem('userphone')){
			next();
		}else{
			next({
				path:'/login',
				query: { redirect: to.fullPath }
			});
		}
	}else{
		next();
	}
})
```

